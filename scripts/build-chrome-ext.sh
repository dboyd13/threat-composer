#!/bin/bash

set -e

yarn install --frozen-lockfile && npx projen
INLINE_RUNTIME_CHUNK=false BUILD_PATH=./chrome_ext_build yarn run build
sed -i .bak 's/<\/body><\/html>/<script src="browserExtensionInterface.js"><\/script><\/body><\/html>/g' packages/threat-composer-app/chrome_ext_build/index.html
mv packages/threat-composer-app/chrome_ext_build/manifest-chrome-ext.json packages/threat-composer-app/chrome_ext_build/manifest.json