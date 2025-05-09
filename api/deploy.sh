#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building CDK app..."
npm run build

echo "🚀 Deploying CDK stack..."
npx cdk deploy --require-approval never

echo "✅ Deployment successful!" 