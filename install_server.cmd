@REM 应该可以了




cd server\file_manager\
npm i -g yarn && yarn config set registry https://registry.npm.taobao.org && yarn && cd .. && cd .. && cd server\print_really\ && pip install pdm && pdm install && echo Install proxy sevrer... && cd .. && cd .. && yarn 
