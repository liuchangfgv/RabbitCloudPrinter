from flask import Flask, jsonify

from config.configs import AUTH_key

import time


# """
# 接口返回信息:
# {code:"201",data:["2021-03-03 19:23"]}
# #显示服务器实时时间
# """
# 插件注册
def register_plugin(app):
  @app.route(AUTH_key+"/api-v2/sys-info", methods=['GET'])
  def api_v2_show_sys_info():
    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    response_data = {
        "code": "201",
        "data": "Great"
    }
    return jsonify(response_data)


#加载插件
def load_plugin(app):
  register_plugin(app)
