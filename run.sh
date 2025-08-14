#!/usr/bin/env bash
set -euo pipefail

# Long Live Kodak - simple static server
# Usage:
#   ./run.sh                # serves on 0.0.0.0:8041
#   ./run.sh 9000           # serves on 0.0.0.0:9000
#   PORT=9000 HOST=127.0.0.1 ./run.sh

PORT="${1:-${PORT:-8041}}"
HOST="${HOST:-0.0.0.0}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Pick python3 if available, else fall back to python
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "Error: Python (python3 or python) is required to run the static server." >&2
  exit 1
fi

echo "Serving ${ROOT_DIR} on http://${HOST}:${PORT}"
exec "$PY" -m http.server "$PORT" --bind "$HOST"
