@echo off
REM Apron Management System - Quick Setup Script (Windows)

setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║     Apron Management System - Full Stack Setup            ║
echo ║          NestJS Backend + Angular Frontend                ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION%

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION%

echo.
echo 🔧 Setting up Backend...
echo.
cd backend

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠ Please update backend\.env with your database credentials
) else (
    echo ✓ .env file already exists
)

echo.
echo ✓ Backend setup complete!
echo.

cd ..

echo 🎨 Setting up Frontend...
echo.
cd frontend

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)

echo.
echo ✓ Frontend setup complete!
echo.
cd ..

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              Setup Complete! Next Steps:                   ║
echo ╠═══════════════════════════════════════════════════════════╣
echo.
echo 1. Start PostgreSQL:
echo    cd backend
echo    docker-compose up -d
echo.
echo 2. Seed the database:
echo    npm run seed
echo.
echo 3. Start the backend (Terminal 1):
echo    npm run start:dev
echo.
echo 4. Start the frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo 5. Open browser:
echo    http://localhost:4200
echo.
echo ╠═══════════════════════════════════════════════════════════╣
echo For more information, see:
echo   - Backend: backend\README.md
echo   - Frontend: frontend\README.md
echo   - Full Stack: FULLSTACK_README.md
echo.
echo ╚═══════════════════════════════════════════════════════════╝
pause
