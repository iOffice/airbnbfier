#!/bin/bash

npm update

VERSION=$(node --eval "console.log(require('./package.json').version);")

npm run specs || exit 1

git checkout -b build

npm run build
git add dist/airbnbfier.js -f

git commit -m "v$VERSION"

git tag v$VERSION -f
git push --tags -f

npm publish

git checkout master
git branch -D build
