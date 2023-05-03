@echo off

@REM for debug
taskkill /f /im python.exe
taskkill /f /im node.exe

echo Starting hi.py...
cd server/print_really/
start pdm run hi.py

cd .. && cd ..

echo Starting hi.py...
cd server/file_manager/
start yarn start


@REM for debug
start http://localhost:7070

echo Starting index.js...
cd ..\..
yarn start


