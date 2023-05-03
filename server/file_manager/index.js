const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs')
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser');
const multer  = require('multer')

const server_port  = 7072;

// 自写lib
const mysql_lib = require('./lib/mysql-lib');
var dayi_login = require('./lib/dayi-login')//登录，自动注册和登录
var dayi_process_file = require('./lib/dayi-process-file')//处理上传文件


// 导入 router
const router = require('./router'); // Importing router from router.js


app.use(cookieParser());
app.use('/', router);

//自动加载插件
const pluginsDir = path.join(__dirname, 'plugins');
fs.readdirSync(pluginsDir).forEach(file => {
  const pluginPath = path.join(pluginsDir, file);
  const plugin = require(pluginPath);
  app.use(plugin);
  console.log(`[${new Date().toLocaleString()}] - INFO - Loaded Plugins：${file}`);
});


app.listen(server_port, () => {
  console.log('http://0.0.0.0:'+server_port);
  console.log(`listening on port [${server_port}]`);
  console.log(`http://localhost:${server_port}`);
});
