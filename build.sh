#!/bin/bash

if [[ $1 == "" ]]; then
echo "Usage: build.sh <tag>"
exit 1
fi

LATEST_TAG=$(git tag | tail -n 1)

echo "Building release $LATEST_TAG"

if [[ $GITHUB_TOKEN == "" ]]; then
echo "Github token not set. Aborting."
exit 1
fi

if [[ $1 != $LATEST_TAG ]]; then
echo "Latest tag does not match build tag"
exit 1
fi

git checkout master
git push --tags

echo "$LATEST_TAG" > dist/VERSION.txt

gulp build

if ![ -f dist/index.html ]; then
echo "Build failed"
exit 1
fi

tar -cvzf gaea-web.tar.gz dist/ Caddyfile

github-release release \
    --user btburke \
    --repo gaea \
    --tag $LATEST_TAG \
    --name "$LATEST_TAG" \
    --description "GAEA website"

github-release upload \
    --user btburke \
    --repo gaea \
    --tag $LATEST_TAG \
    --name "gaea-web.tar.gz" \
    --file gaea-web.tar.gz

rm gaea-web.tar.gz

echo "Release $LATEST_TAG complete and uploaded to Github"