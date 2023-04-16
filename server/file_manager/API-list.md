# API documentation

## Login method

`http://localhost:3000/api/wanna_login`

- 201 注册成功
- 401 已经登录，并且续了cookie
- 411 非法cookie登录，拒绝请求，并申请新的cookie


## File upload 

http://localhost:3000/file-upload.html

## File UPload 

`http://localhost:3000/api/upload_file`

- 201 上传成功
- 401 用户未登录
- 411 用户不存在

## Get user files list method

`http://localhost:3000/api/get_user_files`

- 201 获取用户文件列表成功
- 401 用户未登录
- 411 用户不存在

## Delete file method

`http://localhost:3000/api/delete_file/:uuid`

- 201 删除成功
- 401 用户未登录
- 404 文件不存在或没有权限
- 411 用户不存在，非法操作

## Download file method

`http://localhost:3000/api/download_file/:uuid`

- 201 下载成功
- 401 用户未登录
- 404 文件不存在或没有权限
- 411 用户不存在，非法操作

[]: # Path: server\file_manager\README.md
# file_manager

File manager for file manager

## Install

```shell
npm install -g yarn
yarn install
yarn run start
```

## Run

```shell
npm start
```
