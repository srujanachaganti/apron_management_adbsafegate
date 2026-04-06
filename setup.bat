@echo off
REM Apron Management System - Quick Setup Script (Windows)
REM ========================================================

setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║     Apron Management System - Full Stack Setup            ║
echo ║          NestJS Backend + Angular Frontend                ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check prerequisites
echo [1/6] Checking prerequisites...
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

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠ Docker is not installed. You'll need to set up PostgreSQL manually.
) else (
    for /f "tokens=*" %%i in ('docker -v') do set DOCKER_VERSION=%%i
    echo ✓ Docker found
)

echo.
echo [2/6] Starting PostgreSQL database...
echo.
cd backend
docker-compose up -d
if %errorlevel% neq 0 (
    echo ⚠ Failed to start Docker. Make sure Docker Desktop is running.
    echo   You can start PostgreSQL manually later with: docker-compose up -d
) else (
    echo ✓ PostgreSQL started on port 5432
)

echo.
echo [3/6] Setting up Backend...
echo.

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env >nul 2>nul
    if %errorlevel% neq 0 (
        echo DB_HOST=localhost > .env
        echo DB_PORT=5432 >> .env
        echo DB_USERNAME=postgres >> .env
        echo DB_PASSWORD=postgres >> .env
        echo DB_DATABASE=apron_management >> .env
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> .env
        echo JWT_EXPIRES_IN=24h >> .env
        echo PORT=3000 >> .env
    )
    echo ✓ Created .env file
) else (
    echo ✓ .env file already exists
)

echo.
echo [4/6] Setting up Frontend...
echo.
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)

cd ..

echo.
echo [5/6] Waiting for database to be ready...
echo.
timeout /t 5 /nobreak >nul
echo ✓ Database should be ready

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                    Setup Complete!                         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo [6/6] How to run the application:
echo.
echo   1. Start the Backend (in a new terminal):
echo      cd backend
echo      npm run start:dev
echo.
echo   2. Start the Frontend (in another terminal):
echo      cd frontend
echo      npm start
echo.
echo   3. Open in browser:
echo      http://localhost:4200
echo.
echo   4. Login with:
echo      Email: admin@apron.local
echo      Password: admin123
echo.
echo   Database seeding happens automatically on backend startup.
echo.
echo Happy coding! ✈️
echo.

endlocal
