#!/bin/bash

VERSION=`cat /go/src/archerlog/scripts/version`
ssb-server publish --type post --text "archerlog.com version $VERSION started on `date`" 2>&1 > /dev/null
while true; do
	sleep 86400  # 24 hours
	ssb-server publish --type post --text "archerlog.com healthcheck: `date`" 2>&1 > /dev/null
done
