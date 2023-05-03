const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql_lib = require('../lib/mysql-lib');
const config = require('../lib/dayi-config');
const logger = require('../lib/log_it');


const auth_inside_server_api_key = config.auth_inside_server_api_key; // 定义认证密钥

router.use(bodyParser.json());

// 添加用户打印记录
router.post('/inside_api/insert_user_print_history', (req, res) => {
  // 验证请求头中是否包含认证密钥
  if (req.headers.authorization !== auth_inside_server_api_key) {
    logger.info("非法访问内部API,拒绝请求:"+req.headers.authorization)
    return res.status(401).json({ code: 401, info: 'Unauthorized' });
  }
  // 解析请求体中的数据
  const { userName, printerId } = req.body;
  // 调用插入用户打印记录的函数
  mysql_lib.dayi_insert_user_print_history(userName, printerId)
    .then(() => {
      return res.status(201).json({ code: 201, info: 'Insert user print history success' });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ code: 500, info: 'Server Error' });
    });
});


module.exports = router;
