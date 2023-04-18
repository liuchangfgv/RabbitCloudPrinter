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





// API-upload-file
app.post('/api/file_upload',upload.single('file'),cookieParser(),async function(req,res,next){
  let startTime = new Date().getTime();
  var res_raw = {code:'101',info:''};//返回json的准备的
  var req_body = req.body;

  //如果没有文件返回错误代码
  if(!req.file){
    res_raw.code = '102';
    res_raw.info = '没有文件上传';
    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.write(JSON.stringify(res_raw))
    res.end()
    next()
    return;
  }

  //如果没有登录返回错误代码
  var user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    res_raw.code = '103';
    res_raw.info = '没有登录';
    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.write(JSON.stringify(res_raw))
    res.end()
    next()
    return;
  }

  //如果有文件就进行处理
  if(req.file){
    await dayi_process_file.dayi_process_file(res,req)
    res.end()
  }
  // res.setHeader("Content-Type", "application/json;charset=utf-8")
  // res.write(JSON.stringify(res_raw))
  // res.end()
  // next()

  let endTime = new Date().getTime();
  console.log("[dayi-info]文件上传+处理耗时："+(endTime-startTime)+"ms");

  // dayi_process_file.process_file(res,req,next)
})



app.use(cookieParser());
app.use('/', router);

app.listen(server_port, () => {
  console.log('http://0.0.0.0:'+server_port);
  console.log(`listening on port [${server_port}]`);
  console.log(`http://localhost:${server_port}`);
});
