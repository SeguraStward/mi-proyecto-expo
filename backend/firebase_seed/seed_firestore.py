#!/usr/bin/env python3
"""Seed Firestore from a JSON file with collection arrays.

Expected JSON format:
{
  "collections": {
    "users": [{"id": "user-1", ...}],
    "plants": [{"id": "plant-1", ...}]
  }
}
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore


DEFAULT_BATCH_SIZE = 400
DEFAULT_ENV_PATHS = (Path(".env"), Path("../../.env"))
DEFAULT_DATA_PATH = Path("../data/datos_iniciales.json")


def load_dotenv(paths: tuple[Path, ...]) -> None:
    for dotenv_path in paths:
        resolved = dotenv_path.expanduser().resolve()
        if not resolved.exists():
            continue

        with resolved.open("r", encoding="utf-8") as env_file:
            for raw_line in env_file:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue

                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = value


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import JSON seed data into Firestore")
    parser.add_argument(
        "--credentials",
        default=None,
        help="Path to Firebase service account JSON. Fallback: FIREBASE_CREDENTIALS_PATH",
    )
    parser.add_argument(
        "--data",
        default=None,
        help="Path to seed JSON file. Fallback: FIREBASE_SEED_DATA_PATH",
    )
    parser.add_argument(
        "--project-id",
        default=None,
        help="Optional Firebase project id override",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=DEFAULT_BATCH_SIZE,
        help="Firestore batch size (max 500, recommended <= 400)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and print actions without writing to Firestore",
    )
    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Seed file not found: {path}")
    with path.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    if "collections" not in payload or not isinstance(payload["collections"], dict):
        raise ValueError('Invalid JSON: root key "collections" with object value is required')
    return payload


def init_firestore(credentials_path: Path, project_id: str | None) -> firestore.Client:
    if not credentials_path.exists():
        raise FileNotFoundError(f"Credentials not found: {credentials_path}")

    cred = credentials.Certificate(str(credentials_path))

    if firebase_admin._apps:  # pragma: no cover - only relevant for repeated executions in same process
        app = firebase_admin.get_app()
    else:
        options = {"projectId": project_id} if project_id else None
        app = firebase_admin.initialize_app(cred, options)

    return firestore.client(app=app)


def sanitize_document(raw_doc: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    if not isinstance(raw_doc, dict):
        raise ValueError("Every document must be a JSON object")
    if "id" not in raw_doc:
        raise ValueError("Every document must include an 'id' field")

    doc_id = str(raw_doc["id"])
    doc_data = dict(raw_doc)
    doc_data.pop("id", None)
    return doc_id, doc_data


def commit_batch(batch: firestore.WriteBatch, pending: int, dry_run: bool) -> int:
    if pending == 0:
        return 0

    if not dry_run:
        batch.commit()
    return pending


def seed_collections(
    db: firestore.Client,
    collections: dict[str, Any],
    batch_size: int,
    dry_run: bool,
) -> tuple[int, int]:
    if batch_size < 1 or batch_size > 500:
        raise ValueError("batch-size must be between 1 and 500")

    total_collections = 0
    total_documents = 0
    batch = db.batch()
    pending = 0

    for collection_name, docs in collections.items():
        if not isinstance(docs, list):
            raise ValueError(f"Collection '{collection_name}' must be an array")

        total_collections += 1
        print(f"Processing collection '{collection_name}' with {len(docs)} docs...")

        for raw_doc in docs:
            doc_id, doc_data = sanitize_document(raw_doc)
            doc_ref = db.collection(collection_name).document(doc_id)
            batch.set(doc_ref, doc_data, merge=True)
            pending += 1
            total_documents += 1

            if pending >= batch_size:
                written = commit_batch(batch, pending, dry_run)
                mode = "DRY RUN" if dry_run else "COMMIT"
                print(f"{mode}: wrote {written} docs")
                batch = db.batch()
                pending = 0

    written = commit_batch(batch, pending, dry_run)
    if written:
        mode = "DRY RUN" if dry_run else "COMMIT"
        print(f"{mode}: wrote {written} docs")

    return total_collections, total_documents


def main() -> None:
    load_dotenv(DEFAULT_ENV_PATHS)
    args = parse_args()

    credentials_value = args.credentials or os.getenv("FIREBASE_CREDENTIALS_PATH")
    if not credentials_value:
        raise ValueError(
            "Missing credentials path. Use --credentials or set FIREBASE_CREDENTIALS_PATH in .env"
        )

    data_value = args.data or os.getenv("FIREBASE_SEED_DATA_PATH") or str(DEFAULT_DATA_PATH)
    project_id = args.project_id or os.getenv("FIREBASE_PROJECT_ID")

    credentials_path = Path(credentials_value).expanduser().resolve()
    data_path = Path(data_value).expanduser().resolve()

    payload = load_json(data_path)
    db = init_firestore(credentials_path, project_id)

    total_collections, total_documents = seed_collections(
        db=db,
        collections=payload["collections"],
        batch_size=args.batch_size,
        dry_run=args.dry_run,
    )

    print("-")
    print("Seed completed")
    print(f"Collections: {total_collections}")
    print(f"Documents: {total_documents}")
    print(f"Mode: {'dry-run' if args.dry_run else 'write'}")


if __name__ == "__main__":
    main()
