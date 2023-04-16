import win32print

printer_name = win32print.GetDefaultPrinter()  # 获取默认打印机名称
h_printer = win32print.OpenPrinter(printer_name)  # 打开打印机句柄

# 获取打印机中所有作业
jobs = win32print.EnumJobs(h_printer, 0, -1, 1)

for job in jobs:
    job_id, job_status = job["JobId"], job["Status"]
    pages_printed, total_pages = job["PagesPrinted"], job["TotalPages"]
    if total_pages > 0:
        progress = int(pages_printed / total_pages * 100)
        print(f"作业ID：{job_id}，进度：{progress}%，状态：{job_status}")
    else:
        print(f"作业ID：{job_id}，进度：未知，状态：{job_status}")

win32print.ClosePrinter(h_printer)  # 关闭打印机句柄
