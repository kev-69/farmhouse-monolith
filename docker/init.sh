echo "🔄 Running database migrations..."
npx prisma migrate deploy
echo "🚀 Starting application..."
exec node dist/apps/api/src/main.js