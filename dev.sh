#!/usr/bin/env bash
# ============================================================================
# dev.sh — Levanta el entorno Docker + Expo en un solo comando
# ============================================================================
#
# Uso:
#   ./dev.sh          → Levanta contenedores, instala deps si faltan, inicia Expo
#   ./dev.sh rebuild  → Reconstruye la imagen Docker desde cero
#   ./dev.sh stop     → Detiene los contenedores
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

  # ── Flujo principal: levantar + instalar + expo start ───────────────────────
  start)
    log "Levantando contenedores Docker..."
    docker compose up -d

    log "Verificando dependencias (npm install)..."
    docker compose exec app npm install --prefer-offline 2>/dev/null || \
      docker compose exec app npm install

    ok "Dependencias listas."

    log "Iniciando Expo dev server..."
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Pixel Garden — Expo Dev Server                ${NC}"
    echo -e "${GREEN}  Escanea el QR con Expo Go para ver la app    ${NC}"
    echo -e "${GREEN}  Ctrl+C para detener                          ${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""

    docker compose exec app npx expo start
    ;;

  *)
    echo "Uso: ./dev.sh [start|stop|rebuild]"
    echo ""
    echo "  start    (default) Levanta Docker + instala deps + inicia Expo"
    echo "  stop     Detiene los contenedores"
    echo "  rebuild  Reconstruye la imagen Docker sin cache"
    exit 1
    ;;
esac
