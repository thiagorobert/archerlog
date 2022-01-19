#!/bin/bash

ID=`ssb-server whoami | grep id | sed 's/.*@\(.*\).ed.*/\1/'`
echo "ws://localhost:9000~shs:$ID"
echo "ws://archerlog.com:9000~shs:$ID"
