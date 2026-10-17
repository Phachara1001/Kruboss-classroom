@echo off
title Run Gamified Classroom (Dev)
echo ==========================================
echo        STARTING GAMIFIED CLASSROOM
echo ==========================================

echo.
echo 1. Starting Database and Minio Storage (Docker)...
cd backend
call docker-compose up -d

echo.
echo 2. Starting Backend Server...
start "Backend Server" cmd /c "title Backend Server && npm run dev"

echo.
echo 3. Starting Prisma Studio (Database GUI)...
start "Prisma Studio" cmd /c "title Prisma Studio && npx prisma studio"

echo.
echo 4. Starting Frontend Server (Vite)...
cd ..
start "Frontend Server" cmd /c "title Frontend Server && npm run dev"

echo.
echo All services started successfully!
echo The servers and Prisma Studio are running in separate windows.
pause
