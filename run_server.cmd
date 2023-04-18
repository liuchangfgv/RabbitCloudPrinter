@echo off

echo Starting hi.py...
start cmd \c "cd server\print_really && pdm run hi.py"

echo Starting file_manager/index.js...
cd ..\file_manager
yarn start

echo Starting index.js...
cd ..\..
yarn start
