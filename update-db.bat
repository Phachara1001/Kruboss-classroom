@echo off
title Update Database
echo ==========================================
echo       UPDATING PRISMA DATABASE SCHEMA
echo ==========================================
cd backend
echo Pushing schema to database...
call npx prisma db push
echo.
echo Database update complete!
pause
