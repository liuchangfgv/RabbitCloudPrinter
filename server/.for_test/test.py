import win32print

import win32con

def get_printer_status(printer_name):
    printer_handle = win32print.OpenPrinter(printer_name)
    printer_info = win32print.GetPrinter(printer_handle, 2)
    status = printer_info['Status']
    # if status == win32con.PRINTER_STATUS_PAUSED:
    #     return 'Paused'
    print(status)


def get_printers():
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL, None, 1)
    printer_list = []
    for printer in printers:
        printer_name = printer[0]
        printer_list.append(printer_name)
        get_printer_status(printer_name)
    response_data = {
        "code": 201,
        "info": "获取打印机列表成功",
        "data": printer_list
    }
    # return jsonify(response_data)

get_printers()



# # 测试代码
# printer_name = 'Microsoft Print to PDF'
# print(get_printer_status(printer_name))
