@echo off
title Server running

@REM for debug
taskkill /f /im python.exe
taskkill /f /im node.exe

echo Starting hi.py...
cd server/print_really/
start pdm run hi.py

cd .. && cd ..

echo Starting hi.py...
cd server/file_manager/
start nodemon index.js


@REM for debug
start http://localhost:7070

echo Starting index.js...
cd ..\..
start yarn start


