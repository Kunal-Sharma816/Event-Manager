@echo off
echo Starting EventWeaver Frontend...
echo.

REM Set environment variables
set VITE_API_URL=http://localhost:5000/api

echo Environment variables set.
echo Starting frontend on port 5173...
echo.

REM Start the frontend
npm run dev

pause
