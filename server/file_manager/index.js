const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs')
const app = express();
const cookieParser = require('cookie-parser');
const multer  = require('multer')

const upload = multer({ //处理上传文件信息
  dest: 'upload-tmp/',
  fileFilter(req, file, callback) {
    file.originalname =Buffer.from(file.originalname, 'latin1').toString('utf8');
    callback(null, true);
  },
})




const server_port  = 3000;

// 自写lib
const mysql_lib = require('./lib/mysql-lib');
var dayi_login = require('./lib/dayi-login')//登录，自动注册和登录
var dayi_process_file = require('./lib/dayi-process-file')//处理上传文件


// 导入 router
const router = require('./router'); // Importing router from router.js





// 插件加载
const dayiFileUploadMiddleware = require('./plugins/api_file_upload');

// API-upload-file
app.post('/api/file_upload', upload.single('file'), cookieParser(), dayiFileUploadMiddleware, (req, res, next) => {});






app.use(cookieParser());
app.use('/', router);

app.listen(server_port, () => {
  console.log('http://0.0.0.0:'+server_port);
  console.log(`listening on port [${server_port}]`);
  console.log(`http://localhost:${server_port}`);
});
