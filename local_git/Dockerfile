# Dockerfile
FROM node:alpine

# Install tini, git, and git-http-server
RUN apk add --no-cache tini git \
    && yarn global add git-http-server \
    && adduser -D -g weixin weixin

USER weixin
WORKDIR /home/weixin

# Initialize a repository
RUN git init --bare repository.git

# Set Git identity for the user 'git'
RUN git config --global user.name "Lai Wei Xin" \
    && git config --global user.email "2301894@sit.singaporetech.edu.sg"

# Expose git-http-server
ENTRYPOINT ["tini", "--", "git-http-server", "-p", "3000", "/home/weixin"]
