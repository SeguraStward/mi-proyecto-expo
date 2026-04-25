import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_NAME = 'retro_garden.db';

export type SyncOperation =
  | 'create_plant'
  | 'update_plant'
  | 'delete_plant'
  | 'upload_plant_photo'
  | 'update_user_avatar';
export type SyncStatus = 'pending' | 'in_progress' | 'error';

export interface SyncQueueRow {
  id: number;
  operation: SyncOperation;
  payload: string; // JSON serializado
  status: SyncStatus;
  retries: number;
  lastError: string | null;
  createdAt: string;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function init(): Promise<SQLite.SQLiteDatabase> {
  if (Platform.OS === 'web') {
    // expo-sqlite funciona en web con WASM pero preferimos desactivarlo en este lab
    throw new Error('SQLite no disponible en web');
  }
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retries INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      created_at TEXT NOT NULL
    );
  `);
  dbInstance = db;
  return db;
}

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (!initPromise) initPromise = init();
  return initPromise;
}

export async function enqueue(
  operation: SyncOperation,
  payload: unknown
): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO sync_queue (operation, payload, status, retries, created_at) VALUES (?, ?, ?, ?, ?)',
    [operation, JSON.stringify(payload), 'pending', 0, now]
  );
  return result.lastInsertRowId;
}

export async function getPending(): Promise<SyncQueueRow[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: number;
    operation: SyncOperation;
    payload: string;
    status: SyncStatus;
    retries: number;
    last_error: string | null;
    created_at: string;
  }>(
    "SELECT * FROM sync_queue WHERE status IN ('pending', 'error') ORDER BY id ASC"
  );
  return rows.map((r) => ({
    id: r.id,
    operation: r.operation,
    payload: r.payload,
    status: r.status,
    retries: r.retries,
    lastError: r.last_error,
    createdAt: r.created_at,
  }));
}

export async function countPending(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('pending', 'error')"
  );
  return row?.count ?? 0;
}

export async function markInProgress(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE sync_queue SET status = ? WHERE id = ?', ['in_progress', id]);
}

export async function markCompleted(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

export async function markError(id: number, message: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE sync_queue SET status = ?, retries = retries + 1, last_error = ? WHERE id = ?',
    ['error', message, id]
  );
}

export async function clearAll(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sync_queue', []);
}

export const localDb = {
  enqueue,
  getPending,
  countPending,
  markInProgress,
  markCompleted,
  markError,
  clearAll,
};

export default localDb;
