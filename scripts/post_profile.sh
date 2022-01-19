#!/bin/sh

set -e

VERSION=`cat /go/src/archerlog/scripts/version`
ID=`ssb-server whoami | grep id | sed 's/.*@\(.*\)".*/\1/'`
ssb-server publish --type about --about @$ID --name "archerlog.com $VERSION" --description \
    "archerlog.com: a community for San Francisco GGP archers!"
LOGO_BLOB_ID=`cat /go/src/archerlog/images/logo.png | ssb-server blobs.add`
ssb-server publish --type about --about @$ID --image $LOGO_BLOB_ID
