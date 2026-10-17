@echo off
title First Time Setup - Gamified Classroom
echo ==========================================
echo       FIRST TIME SETUP (INSTALL AND DB)
echo ==========================================

echo.
echo 1. Installing Frontend Dependencies...
call npm install

echo.
echo 2. Installing Backend Dependencies...
cd backend
call npm install

echo.
echo 3. Starting Docker Containers (Postgres AND Minio)...
call docker-compose up -d

echo.
echo Waiting for Database to be ready...
timeout /t 5 /nobreak > nul

echo.
echo 4. Initializing Database Schema (Prisma)...
call npx prisma db push

echo.
echo ==========================================
echo       SETUP COMPLETED SUCCESSFULLY!
echo ==========================================
echo You can now use "run-dev.bat" to start the server next time.
echo.
pause
