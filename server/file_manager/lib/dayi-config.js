const fs = require('fs');
const yaml = require('js-yaml');
const logger = require('./log_it');

//

function get_inside_server_api_key() {
  // 读取config.yaml文件
  const configFile = fs.readFileSync('../../config/config.yaml', 'utf8');
  // 解析yaml格式的配置文件
  const config = yaml.load(configFile);
  // 获取auth_inside_server_api_key
  const auth_inside_server_api_key = config.auth_inside_server_api_key;

  logger.info('auth_inside_server_api_key: ' + auth_inside_server_api_key);

  return auth_inside_server_api_key
}


cookie_key = 'dayi-cookie-for-uploads'

exports.get_inside_server_api_key = get_inside_server_api_key
exports.auth_inside_server_api_key = get_inside_server_api_key()
exports.cookie_key = cookie_key