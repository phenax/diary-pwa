#!/bin/bash
# Start diary-pwa.ml

# Build static stuff
npm run build:css
npm run build:js

# Build go and run binary in background
go build . &&
nohup ./diary-pwa & jobs
