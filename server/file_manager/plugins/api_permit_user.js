const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mysql_lib = require('../lib/mysql-lib');
const logger = require('../lib/log_it');

router.use(cookieParser());

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


/**
 * 授予用户权限
 * @param {string} user_name - 用户名
 * @param {number} permission - 权限值
 * @param {string} permission_source - 授权来源
 */

/**
 * API: 授予用户权限
 */
router.post('/api/grant_permission', cookieParser(), async function(req, res) {
  const { target_user, permission } = req.body;

  const user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    return res.json({ code: 401, info: '用户未登录' })
  }
  const user_name = user_cookie;
  const user_exist = await mysql_lib.dayi_query_user(user_name);
  if (!user_exist) {
    return res.json({ code: 411, info: '用户不存在，非法操作' })
  }
  const user_permission = user_exist.permission;
  if (permission > user_permission) {
    return res.json({ code: 403, info: '无权限授予此等级的权限' });
  }
  try {
    await mysql_lib.dayi_grant_permission(target_user, permission, user_name);
    return res.json({ code: 201, info: '授权成功' });
  } catch (error) {
    console.log(error);
    return res.json({ code: 500, info: '服务器错误，授权失败' });
  }
});


module.exports = router;
