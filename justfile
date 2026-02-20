@default:
    just --list --justfile {{source_file()}}

install:
    npm install

build:
    npx tsc

dev:
    npx tsc --watch

lint:
    npx tsc --noEmit

test:
    npm test

clean:
    rm -rf dist
