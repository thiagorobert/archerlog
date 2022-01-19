#!/bin/sh

set -e

LATEST_ARCHERLOG=${1:-`docker images | awk '{ print $1; }' | grep archerlog | head -1`}

echo "Running $LATEST_ARCHERLOG"

docker run --net host -p 8080:8080 -p 8081:8081 -p 8082:8082 -p 9000:9000 -ti --rm $LATEST_ARCHERLOG
