#!/bin/bash
echo "🚀 Starting AeroFlow Demo..."
echo "Installing dependencies..."
npm install
echo "Starting server..."
open "http://localhost:5173"
node demo-server.js
