#!/bin/bash
# Apron Management System - Quick Setup Script (Unix/Linux/macOS)
# ================================================================

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Apron Management System - Full Stack Setup            ║"
echo "║          NestJS Backend + Angular Frontend                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "[1/6] Checking prerequisites..."
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm $(npm -v)"

if ! command -v docker &> /dev/null; then
    echo "⚠ Docker is not installed. You'll need to set up PostgreSQL manually."
else
    echo "✓ Docker found"
fi

echo ""
echo "[2/6] Starting PostgreSQL database..."
echo ""
cd backend
docker-compose up -d || {
    echo "⚠ Failed to start Docker. Make sure Docker is running."
    echo "  You can start PostgreSQL manually later with: docker-compose up -d"
}
echo "✓ PostgreSQL started on port 5432"

echo ""
echo "[3/6] Setting up Backend..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=apron_management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
PORT=3000
EOF
    fi
    echo "✓ Created .env file"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "[4/6] Setting up Frontend..."
echo ""
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "[5/6] Waiting for database to be ready..."
echo ""
sleep 5
echo "✓ Database should be ready"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "[6/6] How to run the application:"
echo ""
echo "  1. Start the Backend (in a new terminal):"
echo "     cd backend"
echo "     npm run start:dev"
echo ""
echo "  2. Start the Frontend (in another terminal):"
echo "     cd frontend"
echo "     npm start"
echo ""
echo "  3. Open in browser:"
echo "     http://localhost:4200"
echo ""
echo "  4. Login with:"
echo "     Email: admin@apron.local"
echo "     Password: admin123"
echo ""
echo "  Database seeding happens automatically on backend startup."
echo ""
echo "Happy coding! ✈️"
echo ""
