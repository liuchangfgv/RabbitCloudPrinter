const express = require('express');
const fs = require('fs')
const router = express.Router();
const cookieParser = require('cookie-parser');
const multer = require('multer')

//自定义插件
const mysql_lib = require('../lib/mysql-lib');

/*
{
  "code": 201,
  "info": "获取文件路径成功",
  "data": {
    "file_path": "/path/to/file"
  }
}
*/
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