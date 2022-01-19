FROM golang:1.15-alpine


# Install system dependencies.
RUN apk add --update \
	openssh \
	build-base \
	autoconf \
	bash \
	perl \
	libtool \
	automake \
	git \
	npm \
	python3 \
	curl
RUN ln -s /usr/bin/python3 /usr/bin/python


# Install Node dependencies.
RUN npm install --global \
	node-gyp \
	http-server


# Setting up Node v10 since that's required by ssb-server.
WORKDIR /go/src
RUN curl https://nodejs.org/dist/v10.24.1/node-v10.24.1-linux-x64.tar.xz -o node-v10.24.1-linux-x64.tar.xz
RUN tar -xf node-v10.24.1-linux-x64.tar.xz
RUN /go/src/node-v10.24.1-linux-x64/bin/npm install --global \
	sodium-native \
	ssb-server


# Install gotty.
ENV GOPATH=/go
RUN go get github.com/tools/godep
RUN go get github.com/yudai/gotty
WORKDIR /go/src/github.com/tools/godep
RUN go install
WORKDIR /go/src/github.com/yudai/gotty
RUN /go/bin/godep restore
RUN go install
RUN chmod -R a+rwx /go/bin


# Archerlog root directory.
ENV CODE_ROOT=/go/src/archerlog


# Copy code/files.
COPY images ${CODE_ROOT}/images
COPY scripts ${CODE_ROOT}/scripts
COPY ssb-browser-demo ${CODE_ROOT}/ssb-browser-demo
COPY ssb.config ${CODE_ROOT}/config
COPY ssb.secret ${CODE_ROOT}/secret
COPY bootstrap.sh ${CODE_ROOT}/bootstrap.sh


# Build ssb-browser-demo.
WORKDIR ${CODE_ROOT}/ssb-browser-demo
# Use existing 'node_modules'.. for somre reason, npm install is removing 'ssb-brob-files' and causing problems.
# RUN npm install
RUN npm run build


# Expose requierd ports. This is not required, it's more of a documentation.
EXPOSE 8080
EXPOSE 8081
EXPOSE 8082
EXPOSE 9000


# Create logs dir.
ENV LOGS_ROOT=/logs
RUN mkdir ${LOGS_ROOT}
RUN chmod a+rwx ${LOGS_ROOT}


# Bootsrap.
WORKDIR ${CODE_ROOT}
CMD ["/go/src/archerlog/bootstrap.sh"]
