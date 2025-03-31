#!/bin/bash
npm install
npm run build
mkdir -p dist
cp -r src/assets dist/ || true
cp src/index.html dist/ || true 