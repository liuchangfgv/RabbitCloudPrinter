const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mysql_lib = require('../lib/mysql-lib');
const logger = require('../lib/log_it');



router.get('/api/login/:user_name', cookieParser(), async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('charset', 'utf-8');
  const user_name = req.params.user_name;
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }

  res.cookie(cookie_key, user_name, { maxAge: 1000 * 60 * 60 * 24 * 30 });
  const user_permission = await mysql_lib.dayi_query_user_permisson(user_name); // 查询用户权限
  const user_info = {
    user_name: user_name,
    permission: user_permission,
    name: user_exist.name || '',
    stu_number: user_exist.stu_number || '',
  };
  res.json({ code: 201, info: '成功登录用户', user_info });
  return;
});


module.exports = router;
