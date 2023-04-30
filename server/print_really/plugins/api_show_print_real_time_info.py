from flask import Flask, jsonify

from config.configs import AUTH_key

import time
import win32print


# """
# 接口返回信息:
# # {
#   "code": "201",
#   "data": [
#     "\u4f5c\u4e1aID\uff1a4\uff0c\u8fdb\u5ea6\uff1a0%\uff0c\u72b6\u6001\uff1a0",
#     "\u4f5c\u4e1aID\uff1a5\uff0c\u8fdb\u5ea6\uff1a0%\uff0c\u72b6\u6001\uff1a0",
#     "\u4f5c\u4e1aID\uff1a6\uff0c\u8fdb\u5ea6\uff1a0%\uff0c\u72b6\u6001\uff1a0",
#     "\u4f5c\u4e1aID\uff1a16\uff0c\u8fdb\u5ea6\uff1a0%\uff0c\u72b6\u6001\uff1a0"
#   ]
# }
# #显示服务器实时时间
# """
# 插件注册
def register_plugin(app):
  """
  #显示实时的打印信息
  """

  @app.route(AUTH_key+"/api-v2/realtime-print-info", methods=['GET'])
  def api_v2_print_realtime():
    def get_info():
        res = []
        printer_name = win32print.GetDefaultPrinter()  # 获取默认打印机名称
        h_printer = win32print.OpenPrinter(printer_name)  # 打开打印机句柄
        # 获取打印机中所有作业
        jobs = win32print.EnumJobs(h_printer, 0, -1, 1)
        for job in jobs:
            job_id, job_status = job["JobId"], job["Status"]
            pages_printed, total_pages = job["PagesPrinted"], job["TotalPages"]
            if total_pages > 0:
                progress = int(pages_printed / total_pages * 100)
                res.append( f"作业ID：{job_id}，进度：{progress}%，状态：{job_status}")
                
            else:
                res.append(f"作业ID：{job_id}，进度：未知，状态：{job_status}")
        win32print.ClosePrinter(h_printer)  # 关闭打印机句柄
        return res

    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    response_data = {
        "code": "201",
        "data": get_info()
    }
    return jsonify(response_data)




#加载插件
def load_plugin(app):
  register_plugin(app)
