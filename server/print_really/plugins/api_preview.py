from flask import Flask, jsonify, request
import requests
from config.configs import AUTH_key
import os

import time

from config.configs import localhost_path

def get_file_path(dayi_cookie,uuid):
    cookies = {'dayi-cookie-for-uploads':dayi_cookie}
    r = requests.get(localhost_path+"/api/get_user_files",cookies=cookies)
    if r.json()['code'] != 201 :
        return 'Error' # No login
    for l in r.json()['data']:
        if l['uuid'] == uuid:
            return l['file_path']

# 插件注册
def register_plugin(app):
  # 接受一个参数file,为文件uuid
  # 直接返回文件二进制
  @app.route(AUTH_key+"/api-v2/preview", methods=['GET'])
  def preview():
    file_uuid = request.args.get('file')
    file_path = get_file_path(request.cookies.get('dayi-cookie-for-uploads'),file_uuid)
    if file_path == 'Error':
        return jsonify({'code': 412,'info':'打开文件错误'})
    os.system('convert -density 300 '+ '"' + file_path + '"[0] ' + file_path + ".preview.png")
    f = open(file_path + ".preview.png","rb")
    return f.read()


#加载插件
def load_plugin(app):
  register_plugin(app)
