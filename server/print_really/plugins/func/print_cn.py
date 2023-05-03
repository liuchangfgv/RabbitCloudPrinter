import win32print
import tempfile
import win32api

import sys,re
def print_file(filename,printer):
    str1=win32print.GetDefaultPrinter()
    device_name=""
    if printer=="":
        device_name=win32print.GetDefaultPrinter()
    else:
        device_name=printer
        print("[print]更改打印设备到:",device_name,"<br>")
    try:
        win32print.SetDefaultPrinter(device_name)
    except:
        print("[error]尝试修改打印设备失败.","<br>")
        print("[dayi]正在尝试切换为默认设备","<br>")
        try:
            win32print.SetDefaultPrinter(win32print.GetDefaultPrinter())
        except:
            print("[dayi]默认设备切换失败，未知原因","<br>")
    device_name=win32print.GetDefaultPrinter()
    print("[print]现在的设备名:",device_name,"<br>")
    try:
        print("[print]尝试打开文件:",filename,"<br>")
        open(filename,"r")
        try:
            print("[print]正在尝试通过windows api 发送打印命令到打印机:",filename,"<br>")
            win32api.ShellExecute(0, "print", filename, None, ".", 0)
            print("[success_owo]成功啦！打印机命令发送成功","<br>")
        except:
            print("[error]打印命令发送失败","<br>")
    except:
        print("[error]无法打开文件","<br>")
    


if __name__ == "__main__":
    print("<br>\n------兔子云印-----","<br>")
    print("[print]当前的默认打印机: ", win32print.GetDefaultPrinter(),"<br>")
    lenth=len(sys.argv)
    if(lenth==1):
        print("[error]参数不足，正在退出","<br>")
        sys.exit(0)
    print("[print]当前的文件:",sys.argv[1],"<br>")

    #print(re.search(sys.argv[1],"-file"))
    #这里是打印机的名字
    printer_name="EPSON L3150 Series"

    print_file_path=sys.argv[1]
    
    if lenth >2:
        printer_name = sys.argv[2]

    print_file(print_file_path,printer_name)
    print("------兔子云印-----","<br>")