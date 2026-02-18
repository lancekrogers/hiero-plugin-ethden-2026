@default:
    just --list --justfile {{source_file()}}

install:
    npm install

dev:
    node src/index.js

test:
    npm test
