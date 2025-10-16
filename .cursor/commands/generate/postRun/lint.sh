#!/bin/sh
# This script runs the linter on the file that was just generated or edited.
# The $CURSOR_FILE environment variable is automatically provided by Cursor.

# Check if the file exists
if [ -z "$CURSOR_FILE" ]; then
    echo "No file specified for linting"
    exit 0
fi

# Check if the file is a TypeScript/JavaScript file
if [[ "$CURSOR_FILE" == *.ts ]] || [[ "$CURSOR_FILE" == *.tsx ]] || [[ "$CURSOR_FILE" == *.js ]] || [[ "$CURSOR_FILE" == *.jsx ]]; then
    echo "Linting $CURSOR_FILE..."
    npx eslint --fix "$CURSOR_FILE"
    
    # Check if linting was successful
    if [ $? -eq 0 ]; then
        echo "✅ Linting completed successfully"
    else
        echo "⚠️  Linting completed with warnings"
    fi
else
    echo "Skipping linting for non-JavaScript/TypeScript file: $CURSOR_FILE"
fi 