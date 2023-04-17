const express = require('express');
const fs = require('fs')
const router = express.Router();
const cookieParser = require('cookie-parser');
const multer = require('multer')

//lib-dayi
const mysql_lib = require('./lib/mysql-lib');
var dayi_login = require('./lib/dayi-login')//登录，自动注册和登录
const dayi_user_manger = require('./lib/dayi-user')//用户管理

//index.html
router.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.readFile('index.html', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }
    res.end(data);
  });
})



// API-LOGIN
router.get('/api/wanna_login', cookieParser(), async function (req, res, next) {//登录
  const res_raw = await dayi_login.dayi_login(req, res)
  res.setHeader("Content-Type", "application/json;charset=utf-8")
  res.write(JSON.stringify(res_raw))
  res.end()
  next()
});


// API-GET-USER-NAME
router.get('/api/get_user_name', cookieParser(), async function (req, res, next) {
  const res_raw = await dayi_user_manger.dayi_get_user_name(req, res)
  res.setHeader("Content-Type", "application/json;charset=utf-8")
  res.write(JSON.stringify(res_raw))
  res.end()
  next()
})



// HTML-upload-file
router.get('/file-upload.html', cookieParser(), async function (req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.readFile('./html/file-upload.html', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }
    res.end(data);
  });
})

//API -GET-USER-FILE -LIST
router.get('/api/get_user_files', cookieParser(), async function (req, res, next) {
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_exist = await mysql_lib.dayi_query_user(user_cookie)
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在' })
  }
  const user_files = await mysql_lib.dayi_user_files(user_cookie)
  return res.json({ code: 201, info: '获取用户文件列表成功', data: user_files })
})

//API-delete-file
router.get('/api/delete_file/:uuid', cookieParser(), async function (req, res, next) {
  const file_uuid = req.params.uuid;
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  // 检查用户是否存在
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }
  // 检查用户是否有权限删除该文件
  const file_info = await mysql_lib.dayi_user_files(user_name, file_uuid);
  if (!file_info.length) {
    return res.json({ code: 404, info: '文件不存在或没有权限' })
  }
  // 删除数据库中的文件记录
  await mysql_lib.dayi_delete_file_sql(file_uuid);
  // 删除实际文件
  const file_path = file_info[0].file_path;
  fs.unlink(file_path, function (err) {
    if (err) {
      console.error(err);
    }
    console.log('[dayi-info]文件已被删除:', file_path);
  });
  return res.json({ code: 201, info: '删除成功' });
});


//API-DOWNLOAD-FILE
router.get('/api/download_file/:uuid', cookieParser(), async function (req, res, next) {
  const file_uuid = req.params.uuid;
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  // 检查用户是否存在
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }
  // 检查用户是否有权限下载该文件
  const file_info = await mysql_lib.dayi_user_files(user_name, file_uuid);
  if (!file_info.length) {
    return res.json({ code: 404, info: '文件不存在或没有权限' })
  }
  // 下载文件
  const file_path = file_info[0].file_path;
  const file_name = file_info[0].file_name;
  return res.download(file_path, file_name);
});


//API-GET-FILE-PATH
router.get('/api/get_file_path/:uuid', cookieParser(), async function (req, res, next) {
  const file_uuid = req.params.uuid;
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  // 检查用户是否存在
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }
  // 检查用户是否有权限访问该文件
  const file_info = await mysql_lib.dayi_user_files(user_name, file_uuid);
  if (!file_info.length) {
    return res.json({ code: 404, info: '文件不存在或没有权限' })
  }
  // 返回文件路径
  const file_path = file_info[0].file_path;
  return res.json({ code: 201, info: '获取文件路径成功', data: { file_path } })
})



module.exports = router;