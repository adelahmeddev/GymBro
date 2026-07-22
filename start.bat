@echo off
cd /d "D:\GymBro"
start "GymBro" cmd /c "npx vite --host --port 5173"
echo GymBro started on http://localhost:5173/
