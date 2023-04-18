# API documentation

> 这里是文档

## Login method

```
http://localhost:3000/api/wanna_login
```

- 201: Successfully registered and logged in.
- 401: User already logged in, and cookie extended.
- 411: Illegal cookie login, refuse request, and apply for a new cookie.

## File upload

```
http://localhost:3000/file-upload.html
```

## File upload API

```
http://localhost:3000/api/upload_file
```

- 201: Upload successful.
- 401: User not logged in.
- 411: User does not exist.

## Get user files list method

```
http://localhost:3000/api/get_user_files
```

- 201: Successfully obtained the user's file list.
- 401: User not logged in.
- 411: User does not exist.

## Delete file method

```
http://localhost:3000/api/delete_file/:uuid
```

- 201: Successfully deleted.
- 401: User not logged in.
- 404: File does not exist or permission denied.
- 411: User does not exist, illegal operation.

## Download file method

```
http://localhost:3000/api/download_file/:uuid
```

- 201: Successfully downloaded.
- 401: User not logged in.
- 404: File does not exist or permission denied.
- 411: User does not exist, illegal operation.

## Get file path method

```
http://localhost:3000/api/get_file_path/:uuid
```

- 201: Successfully obtained the file path.
- 401: User not logged in.
- 404: File does not exist or permission denied.
- 411: User does not exist, illegal operation.



## Project information

### Install

```
bashCopy codenpm install -g yarn
yarn install
yarn run start
```

### Run

```
bashCopy code
npm start
```
