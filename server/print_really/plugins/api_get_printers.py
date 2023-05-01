from flask import Flask, jsonify

from config.configs import AUTH_key

import time
import win32print


# """
# 接口返回信息:
# 获得打印机列表

# """
# 插件注册
def register_plugin(app):
  @app.route(AUTH_key+"/api-v2/get-printers", methods=['GET'])
  def get_printers():
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL, None, 1)
    printer_list = []
    for printer in printers:
        printer_name = printer[1]
        
        printer_status = win32print.GetPrinter(printer_name, 2)['Status']
        printer_list.append(printer_name)
    response_data = {
        "code": 201,
        "info": "获取打印机列表成功",
        "data": printer_list
    }
    return jsonify(response_data)


#加载插件
def load_plugin(app):
  register_plugin(app)