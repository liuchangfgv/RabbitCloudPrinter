const express = require('express');
const router = express.Router();
const multer = require('multer');
const cookieParser = require('cookie-parser');
const dayi_process_file = require('../lib/dayi-process-file');

const upload = multer({ //处理上传文件信息
  dest: 'upload-tmp/',
  fileFilter(req, file, callback) {
    file.originalname =Buffer.from(file.originalname, 'latin1').toString('utf8');
    callback(null, true);
  },
})

router.post('/api/file_upload', upload.single('file'), cookieParser(), async (req, res, next) => {
  let startTime = new Date().getTime();
  var res_raw = { code: '101', info: '' };
  if (!req.file) {
    res_raw.code = '102';
    res_raw.info = '没有文件上传';
    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.write(JSON.stringify(res_raw))
    res.end()
    next()
    return;
  }

  var user_cookie = req.cookies[cookie_key];
  if (!user_cookie) {
    res_raw.code = '103';
    res_raw.info = '没有登录';
    res.setHeader("Content-Type", "application/json;charset=utf-8")
    res.write(JSON.stringify(res_raw))
    res.end()
    next()
    return;
  }

  if (req.file) {
    await dayi_process_file.dayi_process_file(res, req);
    res.end();
  }

  let endTime = new Date().getTime();
  console.log("[dayi-info]文件上传+处理耗时：" + (endTime - startTime) + "ms");

  // 这里可以根据需要自定义返回值或者操作，如下一步的中间件处理等
  next();
});

module.exports = router;
