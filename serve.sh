#!/usr/bin/env bash
#
# Local preview server for the AIS static site.
#
# Builds with build/build.mjs, then serves docs/ over HTTP so absolute
# root-relative paths (/assets/..., /es/...) resolve the same way they do
# once deployed. No web server dependency beyond what macOS ships: bash and
# python3's http.server.
#
# Usage:
#   ./serve.sh              # production-style build, served at http://localhost:8000
#   ./serve.sh --preview    # GitHub Pages preview build, served at http://localhost:8000/ais-web/
#   ./serve.sh --port 3000  # custom port, works with either mode
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_SCRIPT="$ROOT/build/build.mjs"

PREVIEW=0
PORT=8000

usage() {
  cat <<'USAGE'
Usage: ./serve.sh [--preview] [--port N]

  --preview     Build with BASE_PATH=/ais-web and serve it at
                http://localhost:PORT/ais-web/, matching the GitHub Pages
                project-site URL structure exactly.
  --port N      Port to serve on (default: 8000).
  -h, --help    Show this help.

Without --preview, builds production-style (no base path) and serves at
http://localhost:PORT/.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --preview)
      PREVIEW=1
      shift
      ;;
    --port)
      if [[ $# -lt 2 ]]; then
        echo "error: --port requires a value" >&2
        exit 1
      fi
      PORT="$2"
      shift 2
      ;;
    --port=*)
      PORT="${1#--port=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  echo "error: --port must be a positive integer, got: $PORT" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 is required to serve the site locally but was not found on PATH." >&2
  echo "Install it via 'xcode-select --install' or 'brew install python3', then retry." >&2
  exit 1
fi

SERVER_PID=""
PREVIEW_TMP_DIR=""

cleanup() {
  trap - EXIT INT TERM
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  if [[ -n "$PREVIEW_TMP_DIR" ]]; then
    rm -rf "$PREVIEW_TMP_DIR"
  fi
}
trap cleanup EXIT INT TERM

if [[ "$PREVIEW" -eq 1 ]]; then
  echo "Building preview (BASE_PATH=/ais-web)..."
  BASE_PATH=/ais-web node "$BUILD_SCRIPT"

  # GitHub Pages project sites serve at /<repo>/, but docs/ has no such
  # prefix on disk. Reproduce that URL structure exactly, without a web
  # server dependency, by serving a temp directory that symlinks
  # ais-web -> docs.
  PREVIEW_TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ais-web-preview.XXXXXX")"
  ln -s "$ROOT/docs" "$PREVIEW_TMP_DIR/ais-web"
  SERVE_DIR="$PREVIEW_TMP_DIR"
  # docs/index.html's client-side redirect targets root-relative /es/, not
  # /ais-web/es/ (it is written directly, outside the BASE_PATH rewrite) —
  # the same is true once this deploys to GitHub Pages. Point at /es/
  # directly so the printed URL always resolves.
  URL="http://localhost:$PORT/ais-web/es/"
else
  echo "Building (production-style, no base path)..."
  BASE_PATH= PREVIEW= node "$BUILD_SCRIPT"
  SERVE_DIR="$ROOT/docs"
  URL="http://localhost:$PORT/"
fi

echo "Serving $SERVE_DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$SERVE_DIR" &
SERVER_PID=$!

# Give the server a beat to bind before declaring it ready.
sleep 0.3
if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "error: server failed to start (port $PORT may already be in use). Try --port N." >&2
  exit 1
fi

echo ""
echo "  -> $URL"
echo ""
echo "Press Ctrl+C to stop."

wait "$SERVER_PID"
