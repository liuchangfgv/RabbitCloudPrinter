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
        print("[print]change device to:",device_name,"<br>")
    try:
        win32print.SetDefaultPrinter(device_name)
    except:
        print("[error]trying to change printer failure.","<br>")
        print("[dayi]Trying to change the printer to default printer","<br>")
        try:
            win32print.SetDefaultPrinter(win32print.GetDefaultPrinter())
        except:
            print("[dayi]QWQ,error!!!!","<br>")
    device_name=win32print.GetDefaultPrinter()
    print("[print]now devices name:",device_name,"<br>")
    try:
        print("[print]trying to open file:",filename,"<br>")
        open(filename,"r")
        try:
            print("[print]trying to sending command to windows and print:",filename,"<br>")
            win32api.ShellExecute(0, "print", filename, None, ".", 0)
            print("[success_owo]The print request has sent to the printer!owo!!!","<br>")
        except:
            print("[error]sending command error !","<br>")
    except:
        print("[error]opening file error!","<br>")
    


if __name__ == "__main__":
    print("------dayi-print-----","<br>")
    print("[print]now default printer: ", win32print.GetDefaultPrinter(),"<br>")
    lenth=len(sys.argv)
    if(lenth==1):
        print("[error]argv is not enough!!!!exiting...","<br>")
        sys.exit(0)
    print("[print]now file path:",sys.argv[1],"<br>")

    #print(re.search(sys.argv[1],"-file"))
    #这里是打印机的名字
    printer_name="EPSON L3150 Series"

    print_file_path=sys.argv[1]
    print_file(print_file_path,printer_name)
    print("------dayi-print-----","<br>")