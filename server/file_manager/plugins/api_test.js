const express = require('express');
const router = express.Router();

router.get('/api/test', (req, res, next) => {
 // if (!res.headersSent) { // 检查响应是否已发送
    res.json({ code: 201, info: '服务器运行正常' });
//  }
});

module.exports = router;
