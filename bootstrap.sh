#!/bin/sh

set -e

echo "starting a file server...."
cd ${LOGS_ROOT}
python3 -m http.server 8081 2>&1  > ${LOGS_ROOT}/fileserver.log &
cd -

echo "starting gotty...."
/go/bin/gotty --port 8082 -w /bin/bash 2>&1  > ${LOGS_ROOT}/gotty.log &

echo "starting ssb-browser-demo..."
cd /go/src/archerlog/ssb-browser-demo/dist
npx http-server --port 8080 | tee ${LOGS_ROOT}/pounch.log &

echo "starting ssb-server..."
if [ ! -d "/root/.ssb" ]; then
  echo "setting up ssb-server..."
  rm -rf /root/.ssb/node_modules
  rm -rf /root/.ssb/config
  rm -rf /root/.ssb/secret
  mkdir -p /root/.ssb/node_modules
  cd /root/.ssb/node_modules
  git clone https://github.com/arj03/ssb-partial-replication
  git clone https://github.com/ssbc/ssb-tunnel
  cd /root/.ssb/node_modules/ssb-partial-replication
  /go/src/node-v10.24.1-linux-x64/bin/npm install
  cd /root/.ssb/node_modules/ssb-tunnel
  /go/src/node-v10.24.1-linux-x64/bin/npm install
  cp /go/src/archerlog/config /root/.ssb/config
  cp /go/src/archerlog/secret /root/.ssb/secret
fi

ssb-server start --logging.level=info | tee ${LOGS_ROOT}/ssb-server.info &
sleep 10
/go/src/archerlog/scripts/ws_address.sh
/go/src/archerlog/scripts/post_profile.sh
/go/src/archerlog/scripts/post_date.sh &
/go/src/archerlog/scripts/auto_follow.sh

