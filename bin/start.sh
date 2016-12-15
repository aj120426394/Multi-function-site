#!/usr/bin/env bash

pushd /app/multi-function-site
  /usr/bin/npm start &> ./server.log;
popd
