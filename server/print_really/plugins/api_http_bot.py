import requests
import os
import tempfile
from flask import Flask, jsonify, request

import config.configs as configs
import plugins.func.func_get_server_config as server_config 
import plugins.func.func_exec_print_command as print_command

AUTH_key = configs.AUTH_key
http_auth_key = server_config.get_http_api_key()



def register_plugin(app):
  @app.route(AUTH_key+"/api-v2/http-bot", methods=['GET'])
  def bot_api():
    auth = request.args.get('auth_key')
    if auth != http_auth_key:
        return jsonify({'code': 401, 'msg': 'Unauthorized'})
    image_url = request.args.get('image_url')

    response = requests.get(image_url) # 获取图片
    if response.status_code != 200:
        return jsonify({'code': 400, 'msg': 'Bad Request'})

    with tempfile.NamedTemporaryFile(delete=False) as f:
        f.write(response.content)
        image_path = f.name

    res = print_command.print_with_out_auth(filepath=image_path,username="bot-api")
    
    os.unlink(image_path)  # 删除临时文件
    return jsonify({'code': 201, 'msg': res})
    return




#加载插件
def load_plugin(app):
  register_plugin(app)