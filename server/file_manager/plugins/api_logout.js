const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mysql_lib = require('../lib/mysql-lib');
const logger = require('../lib/log_it');



router.get('/api/logout', cookieParser(), async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('charset', 'utf-8');
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }

  res.clearCookie(cookie_key);
  res.end(JSON.stringify({ code: 201, info: '成功注销用户' }))
  return;
});


module.exports = router;
