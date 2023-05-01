import win32print
def get_printers():
    printers = win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL, None, 1)
    printer_list = []
    for printer in printers:
        printer_name = printer[0]
        printer_list.append(printer_name)
    response_data = {
        "code": 201,
        "info": "获取打印机列表成功",
        "data": printer_list
    }
    return jsonify(response_data)


get_printers()