const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const mysql_lib = require('../lib/mysql-lib');
const config = require('../lib/dayi-config')

router.post('/api/inside_insert_user_print_history', cookieParser(),
    async function(req, res) {
      // 获取请求头中的认证信息
      const authHeader = req.headers.authorization;
      const apiKey = authHeader && authHeader.split(' ')[1];

      // 判断API Key是否匹配
      if (apiKey !== config.auth_inside_server_api_key) {
        return res.status(401).json({code: 401, info: '认证失败'});
      }

      // 解析请求体
      const {uuid, printer_id,print_file_name} = req.body;

      // 获取用户cookie
      const user_cookie = req.cookies[cookie_key];
      if (!user_cookie) {
        return res.json({code: 401, info: '用户未登录'})
      }
      const user_name = user_cookie;

      // 检查用户是否存在
      const user_exist = await mysql_lib.dayi_query_user(user_name);
      if (!user_exist) {
        return res.json({code: 411, info: '用户不存在，非法操作'})
      }

      // 插入打印历史记录
      try {
        await mysql_lib.dayi_insert_user_print_history(user_name, uuid, printer_id,print_file_name);

        return res.json({code: 201, info: '插入用户打印记录成功'});
      } catch (error) {
        console.log(error);
        return res.json({code: 500, info: '服务器错误'});
      }
    });

module.exports = router;
