#!/bin/bash

# Apron Management System - Quick Setup Script
# Run this script to set up both backend and frontend

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Apron Management System - Full Stack Setup            ║"
echo "║          NestJS Backend + Angular Frontend                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is not installed. You'll need it for PostgreSQL.${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Setting up Backend...${NC}"
echo ""
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update backend/.env with your database credentials${NC}"
else
    echo "✓ .env file already exists"
fi

echo ""
echo -e "${BLUE}🚀 Backend setup complete!${NC}"
echo ""

cd ..

echo -e "${BLUE}🎨 Setting up Frontend...${NC}"
echo ""
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

echo ""
echo -e "${BLUE}🎉 Frontend setup complete!${NC}"
echo ""
cd ..

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Setup Complete! Next Steps:                   ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo ""
echo -e "${YELLOW}1. Start PostgreSQL:${NC}"
echo "   cd backend"
echo "   docker-compose up -d"
echo ""
echo -e "${YELLOW}2. Seed the database:${NC}"
echo "   npm run seed"
echo ""
echo -e "${YELLOW}3. Start the backend (Terminal 1):${NC}"
echo "   npm run start:dev"
echo ""
echo -e "${YELLOW}4. Start the frontend (Terminal 2):${NC}"
echo "   cd frontend"
echo "   npm start"
echo ""
echo -e "${YELLOW}5. Open browser:${NC}"
echo "   http://localhost:4200"
echo ""
echo "╠═══════════════════════════════════════════════════════════╣"
echo "For more information, see:"
echo "  - Backend: backend/README.md"
echo "  - Frontend: frontend/README.md"
echo "  - Full Stack: FULLSTACK_README.md"
echo "║                                                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
