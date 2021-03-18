#!/usr/bin/env bash
# 该脚本由pm2调用来启动服务器
PORT=80 NODE_ENV=production node ./bin/www
