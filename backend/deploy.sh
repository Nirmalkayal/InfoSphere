#!/bin/bash

# Exit on error
set -e

echo "Deploying TurfHub Backend..."

# 1. Install Dependencies
echo "Installing dependencies..."
npm install --production

# 2. Check Environment Variables
if [ ! -f .env ]; then
    echo "WARNING: .env file not found! Copying from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env from example. PLEASE UPDATE SECRETS!"
    else
        echo "ERROR: No .env or .env.example found."
        exit 1
    fi
fi

# 3. Start Server
echo "Starting server..."
npm start
