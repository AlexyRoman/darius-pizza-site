#!/bin/sh
# This script runs tests for the modified file

# Get the directory of the modified file
FILE_DIR=$(dirname "$CURSOR_FILE")
FILE_NAME=$(basename "$CURSOR_FILE")

# Look for corresponding test file
TEST_FILE="${FILE_DIR}/__tests__/${FILE_NAME%.*}.test.${FILE_NAME##*.}"
TEST_FILE_TS="${FILE_DIR}/__tests__/${FILE_NAME%.*}.test.ts"

if [ -f "$TEST_FILE" ] || [ -f "$TEST_FILE_TS" ]; then
    echo "Running tests for $CURSOR_FILE..."
    npm test -- --testPathPattern="$FILE_NAME"
else
    echo "No test file found for $CURSOR_FILE"
fi 