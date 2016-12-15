#!/usr/bin/env bash

printf "Running setup command...\n";

sudo cp /app/multi-function-site/config/service/multi-function-site.service /etc/systemd/system/multi-function-site.service
sudo systemctl enable multi-function-site.service

printf "setup command finished.\n";
