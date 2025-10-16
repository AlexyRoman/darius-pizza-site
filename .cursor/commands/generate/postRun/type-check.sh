#!/bin/sh
# This script runs TypeScript type checking after code generation

echo "Running TypeScript type check..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ Type checking passed"
else
    echo "❌ Type checking failed"
    exit 1
fi 