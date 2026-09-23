#!/bin/bash
set -e

echo "=============================================="
echo "  Mera World - Complete Fix Script"
echo "=============================================="

echo ""
echo "→ Stopping any running server on port 8080..."
fuser -k 8080/tcp 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 1

echo ""
echo "→ Creating correct .env file..."
cat > .env << 'EOF'
# Auth (required)
BETTER_AUTH_SECRET="mera-world-super-secret-key-change-me-123456789abcdef"
BETTER_AUTH_URL="http://localhost:8080"

# Auth ENABLED (important)
VITE_AUTH_ENABLED="true"

# Local development - NO real database (use PGLite)
# DATABASE_URL is intentionally not set
EOF

echo "✓ .env updated"
echo ""
cat .env
echo ""

echo "→ Cleaning old caches..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .vite
rm -rf .output 2>/dev/null || true

echo "→ Installing dependencies (if needed)..."
npm install

echo ""
echo "→ Starting development server..."
echo "=============================================="
echo "  Open this URL in browser:"
echo "  →  http://localhost:8080"
echo ""
echo "  Steps after open:"
echo "  1. Login with your admin username/password"
echo "  2. Accept Terms & Privacy Agreement"
echo "  3. Game should load"
echo "=============================================="
echo ""

npm run dev0
