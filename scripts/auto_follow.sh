#!/bin/bash

while true; do
  for I in `cat /logs/ssb-server.info | grep Connected | awk '{print $4}' | sort -u`; do
    ssb-server feed | grep $I
    if [ $? -ne 0 ]; then
      echo "archerlog.com: auto-following $I"
      ssb-server publish --type contact --contact $I --following 2>&1 > /dev/null
    fi
  done
  sleep 60
done
