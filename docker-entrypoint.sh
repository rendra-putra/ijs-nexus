#!/bin/sh
set -e

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
  VITE_API_ENGINE_URL: "${VITE_API_ENGINE_URL}"
};
EOF

exec "$@"
