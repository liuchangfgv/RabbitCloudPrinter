const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql_lib = require('../lib/mysql-lib');
const config = require('../lib/dayi-config');
const logger = require('../lib/log_it');


const auth_inside_server_api_key = config.auth_inside_server_api_key; // 定义认证密钥

router.get('/inside_api/check_permission/:user_name', async (req, res) => {
  if (req.headers.authorization !== auth_inside_server_api_key) {
    logger.error("非法访问内部API,拒绝请求:"+req.headers.authorization)
    return res.status(401).json({ code: 401, info: 'Unauthorized' });
  }

  const user_name = req.params.user_name;
  const permission = await mysql_lib.dayi_query_user_permisson(user_name);
  if (permission < 1){
    return res.status(200).json({ code: "401", info: `权限不足，您的权限是${permission},需要至少1级权限才可以打印` });
  }
  return res.status(200).json({ code: "201", info: "鉴权成功" });
});

module.exports = router;
