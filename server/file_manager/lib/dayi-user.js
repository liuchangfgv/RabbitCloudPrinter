// API-GET-USER-NAME

var the_config = require('./dayi-config');
const mysql_lib = require('./mysql-lib');

const cookie_key = the_config.cookie_key; //COOKIE KEY 

async function get_user_name(req, res, next) {


  res_info = {code: 201,info:'success',data: {username: ''}};
  const cookie = req.cookies[cookie_key];
  if (cookie) {

    check_user_is_valid = await mysql_lib.dayi_query_user(cookie)
    if(!upload_file_user){
      res_info = {code: 411,info: '用户不合法，非法用户'}
      return res.json(res_info);
    }
    
    res_info['code'] = 201;
    res_info['data']['username'] = cookie['username']
  } else {
    res_info['code'] = 401;
    res_info['info'] = 'no cookie found';
  }
  return res.json(res_info);
}

exports.get_user_name= this.get_user_name
