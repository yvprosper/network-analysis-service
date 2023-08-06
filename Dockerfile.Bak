# # This file is part of [Your application name]
# #
# # (c) 2020 Youverify Inc <identity@youverify.co]>
# # Unauthorized copying of this file, via any medium is strictly prohibited
# #
# # ------------------------------------------------------------------------
# #
# # Proprietary and confidential
# #
# # @module Dockerfile
# # @author [Ehichioya Prior Famous] <[famous@youverify.co]>
# #

FROM node:12.18.3-alpine as base

FROM base as builder

# deps for post-install scripts
RUN apk add --update --no-cache \
    python \
    make \
    git \
    g++

WORKDIR /usr/src/app

COPY package.json ./

# npm rebuild bcrypt --update-binary
# RUN npm install --only=production && npm rebuild bcrypt --build-from-source && NODE_ENV=development npm run build
RUN yarn install

FROM base

# RUN GRPC_HEALTH_PROBE_VERSION=v0.2.0 && \
#     wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
#     chmod +x /bin/grpc_health_probe

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY . .

ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}

RUN yarn build && yarn build:docs

EXPOSE 30041 30042



CMD [ "node", "dist/start.js" ]

