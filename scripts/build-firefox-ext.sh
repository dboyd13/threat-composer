#!/bin/bash

set -e

yarn install --frozen-lockfile && npx projen
INLINE_RUNTIME_CHUNK=false BUILD_PATH=./firefox_ext_build yarn run build
sed -i .bak 's/<\/body><\/html>/<script src="browserExtensionInterface.js"><\/script><\/body><\/html>/g' packages/threat-composer-app/firefox_ext_build/index.html
mv packages/threat-composer-app/firefox_ext_build/manifest-firefox-ext.json packages/threat-composer-app/firefox_ext_build/manifest.json