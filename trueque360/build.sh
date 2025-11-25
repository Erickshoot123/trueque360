#!/bin/bash
# Build script for Render deployment
set -e

echo "📦 Installing backend dependencies..."
cd backend
npm install --production

echo "✅ Build completed successfully"
