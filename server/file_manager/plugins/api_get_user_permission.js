const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mysql_lib = require('../lib/mysql-lib');
const logger = require('../lib/log_it');

router.use(cookieParser());

router.get('/api/get_permission', cookieParser(), async function(req, res) {
  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }
  const user_permission = await mysql_lib.dayi_query_user_permisson(user_name);
  logger.info(`用户:${user_name} 获取权限成功，权限：${user_permission}` );
  return res.json({ code: 201, info: '获取权限成功', permission: user_permission });
});


module.exports = router;
