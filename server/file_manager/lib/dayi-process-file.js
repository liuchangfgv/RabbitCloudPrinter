
const dayi_user_manger = require('./dayi-user')
const config = require('./dayi-config')
const fs = require('fs')
const sql = require('./mysql-lib')
const path = require('path')
const cute_uuid = require('./cute-uuid')


async function process_file(res,req,next){
  upload_file_name = req.file['originalname'] //文件名
  upload_file_path = req.file['path'] //文件路径
  upload_file_size = req.file['size']/1024 //文件大小
  const user_cookie = req.cookies[cookie_key];

  if(!user_cookie){
    return res.json({code: 401,info: '用户未登录'})
  }

  upload_file_user = await sql.dayi_query_user(user_cookie)
  
  if(!upload_file_user){
    return res.json({code: 411,info: '用户不合法，非法操作'})
  }

  user_name = user_cookie;

  console.log('[dayi-info]用户:'+user_name)
  console.log('[dayi-info]上传文件名:'+upload_file_name)
  console.log('[dayi-info]上传文件临时路径:'+upload_file_path)
  console.log('[dayi-info]上传文件大小:'+upload_file_size+'kb')

  // 保存文件到用户目录
  const userDir = path.join(__dirname, '../upload', user_name);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  //cute_uuid.uuid_cute("file_")
  const destFilePath = path.join(userDir, upload_file_name);
  fs.renameSync(upload_file_path, destFilePath);

  // Remove temporary file
  // fs.unlinkSync(upload_file_path);
  
  console.log('[dayi-info]用户目录:'+user_name)
  console.log('[dayi-info]上传文件路径:'+destFilePath)

  //插入数据库
  const file_uuid = cute_uuid.uuid_cute('');
  await sql.dayi_insert_file(destFilePath, user_name, file_uuid, upload_file_size, upload_file_name);

  //设置头为json
  res.setHeader('Content-Type', 'application/json');
  res.json({code: 200,info: '上传成功'})
  next();
}



exports.process_file = process_file
