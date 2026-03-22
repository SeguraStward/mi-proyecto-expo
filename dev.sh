#!/usr/bin/env bash
# ============================================================================
# dev.sh — Levanta el entorno Docker + Expo en un solo comando
# ============================================================================
#
# Uso:
#   ./dev.sh          → Levanta contenedores, valida deps y inicia Expo
#   ./dev.sh deps     → Fuerza instalacion de dependencias en contenedor app
#   ./dev.sh rebuild  → Reconstruye la imagen Docker desde cero
#   ./dev.sh stop     → Detiene los contenedores
#   ./dev.sh seed-dry-run → Valida seed de Firestore sin escribir
#   ./dev.sh seed-write   → Ejecuta seed real en Firestore
#
# ============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# ── Colores para output ──────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

log()   { echo -e "${CYAN}[dev]${NC} $1"; }
ok()    { echo -e "${GREEN}[ok]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
fail()  { echo -e "${RED}[error]${NC} $1"; exit 1; }

lock_hash() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum package-lock.json | awk '{print $1}'
  else
    shasum -a 256 package-lock.json | awk '{print $1}'
  fi
}

install_deps() {
  local hash="$1"
  log "Instalando dependencias (npm install)..."
  docker compose exec -T app npm install --prefer-offline 2>/dev/null || \
    docker compose exec -T app npm install
  docker compose exec -T app sh -lc "printf '%s' '$hash' > /app/node_modules/.deps-lock-hash"
  ok "Dependencias actualizadas."
}

ensure_deps() {
  local hash="$1"
  if docker compose exec -T app sh -lc "[ -d /app/node_modules ] && [ -f /app/node_modules/.deps-lock-hash ] && [ \"\$(cat /app/node_modules/.deps-lock-hash)\" = \"$hash\" ]"; then
    ok "Dependencias al dia (sin npm install)."
  else
    install_deps "$hash"
  fi
}

# ── Comandos ─────────────────────────────────────────────────────────────────

case "${1:-start}" in

  # ── Detener todo ────────────────────────────────────────────────────────────
  stop)
    log "Deteniendo contenedores..."
    docker compose down
    ok "Contenedores detenidos."
    ;;

  # ── Rebuild completo ────────────────────────────────────────────────────────
  rebuild)
    log "Reconstruyendo imagen Docker (sin cache)..."
    docker compose down
    docker compose build --no-cache
    ok "Imagen reconstruida. Ejecuta ./dev.sh para iniciar."
    ;;

  # ── Instalacion forzada de dependencias ───────────────────────────────────
  deps)
    log "Levantando contenedor app..."
    docker compose up -d app
    HASH="$(lock_hash)"
    install_deps "$HASH"
    ;;

  # ── Seed Firestore en modo validacion (sin escribir) ──────────────────────
  seed-dry-run)
    log "Construyendo servicio seed (si hace falta)..."
    docker compose build seed

    log "Ejecutando seed en modo dry-run..."
    docker compose run --rm seed python seed_firestore.py --dry-run
    ok "Dry-run completado."
    ;;

  # ── Seed Firestore en modo escritura real ──────────────────────────────────
  seed-write)
    log "Construyendo servicio seed (si hace falta)..."
    docker compose build seed

    warn "Se va a escribir en Firestore con la configuracion actual de backend/firebase_seed/.env"
    log "Ejecutando seed en modo write..."
    docker compose run --rm seed python seed_firestore.py
    ok "Seed write completado."
    ;;

  # ── Flujo principal: levantar + instalar + expo start ───────────────────────
  start)
    log "Levantando contenedor app..."
    docker compose up -d app

    HASH="$(lock_hash)"
    ensure_deps "$HASH"

    log "Iniciando Expo con tunnel (puede tardar ~30s la primera vez)..."
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Pixel Garden — Expo Dev Server (Tunnel)       ${NC}"
    echo -e "${GREEN}  Escanea el QR con Expo Go desde cualquier red ${NC}"
    echo -e "${GREEN}  Ctrl+C para detener                          ${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""

    docker compose exec app npx expo start --tunnel
    ;;

  *)
    echo "Uso: ./dev.sh [start|deps|stop|rebuild|seed-dry-run|seed-write]"
    echo ""
    echo "  start    (default) Levanta app + valida deps + inicia Expo"
    echo "  deps     Fuerza npm install dentro del contenedor app"
    echo "  stop     Detiene los contenedores"
    echo "  rebuild  Reconstruye la imagen Docker sin cache"
    echo "  seed-dry-run  Valida seed Firestore sin escribir"
    echo "  seed-write    Ejecuta seed real en Firestore"
    exit 1
    ;;
esac
