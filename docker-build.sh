#!/bin/sh

set -e

rm -rf ssb-browser-demo/build/ ssb-browser-demo/dist/
docker build "$@" . -t archerlog-v`date +"%Y%m%d%H%M%S"`
