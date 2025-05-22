@echo off
echo "Starting Next.js dev server..."
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
cd /d %~dp0
npx next dev 