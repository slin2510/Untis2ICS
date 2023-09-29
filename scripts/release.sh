#!/bin/bash
ncc build build/main.js -o release
cp .env.template release/.env
cp -r templates release/templates/
zip -r BerichtsheftGenerator.zip release/
rm -rf release/

