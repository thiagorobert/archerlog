#!/bin/sh

set -e

LATEST_ARCHERLOG=`docker images | awk '{ print $1; }' | grep archerlog- | head -1`
eval $(aws ecr get-login | sed 's|https://||' | sed 's|-e none ||')
docker tag $LATEST_ARCHERLOG 438075176236.dkr.ecr.us-east-1.amazonaws.com/pounch:latest
docker push 438075176236.dkr.ecr.us-east-1.amazonaws.com/pounch:latest
docker tag $LATEST_ARCHERLOG 438075176236.dkr.ecr.us-east-1.amazonaws.com/ssbws:latest
docker push 438075176236.dkr.ecr.us-east-1.amazonaws.com/ssbws:latest
