import os
from flask import Flask, request, redirect, url_for, render_template
from flask import jsonify
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import time,random,os
from PIL import Image
# import win32com.client
# from fpdf import FPDF
from docx2pdf import convert as doc2pdf
# import fitz
import requests
import win32print

app = Flask(__name__)

#config
AUTH_key="/Auth_dayi_Owo_key" 
AUTH_key="" #临时禁用AUTH_key


ALLOWED_EXTENSIONS = set(['docx','doc','ppt','pptx','xls','xlsx','txt', 'pdf', 'jpg', 'gif', 'png', 'jpeg','bmp'])
ALLOWED_PICS=set(['jpg', 'gif', 'png', 'jpeg','bmp'])
UPLOAD_FOLDER = 'uploads'


@app.route(AUTH_key+"/")
def upload_file():
    web_str_time="服务器时间:"+time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
    return render_template("upload.html",str_time=web_str_time)


"""
接口返回信息:
{code:"201",data:["2021-03-03 19:23"]}
#显示服务器实时时间
"""
@app.route(AUTH_key+"/api-v2/time", methods=['GET'])
def api_v2_time():
    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    response_data = {
        "code": "201",
        "data": [current_time]
    }
    return jsonify(response_data)

"""
接口返回信息:
{code:"201",data:["2021-03-03 19:23"]}
#显示实时的打印信息
"""
@app.route(AUTH_key+"/api-v2/realtime-print-info", methods=['GET'])
def api_v2_print_realtime():
    def get_info():
        res = ""
        printer_name = win32print.GetDefaultPrinter()  # 获取默认打印机名称
        h_printer = win32print.OpenPrinter(printer_name)  # 打开打印机句柄
        # 获取打印机中所有作业
        jobs = win32print.EnumJobs(h_printer, 0, -1, 1)
        for job in jobs:
            job_id, job_status = job["JobId"], job["Status"]
            pages_printed, total_pages = job["PagesPrinted"], job["TotalPages"]
            if total_pages > 0:
                progress = int(pages_printed / total_pages * 100)
                res+= f"作业ID：{job_id}，进度：{progress}%，状态：{job_status}"
                
            else:
                res+= f"作业ID：{job_id}，进度：未知，状态：{job_status}"
        win32print.ClosePrinter(h_printer)  # 关闭打印机句柄
        return res

    current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    response_data = {
        "code": "201",
        "data": get_info()
    }
    return jsonify(response_data)


"""
JSON 格式表单接收
{code:"201",info:"前端传递的数据",data:{filename:"文件名",filepath:"文件路径",...}}
e.g. 
{'code': '201', 'info': '前端传递的数据', 'data': {'file': {}, 'blackAndWhitePrinting': 'on', 'deleteAfterPrinting': 'on', 'printAllPages': 'on', 'pageRange': ''}}
"""

"""
201: 成功
411: 请求错误
412：获取文件名错误
413：截取页数失败 有较大概率是输入错误
"""
@app.route(AUTH_key+"/api-v2/post_json", methods=['POST'])
def json_form_accept():
    str1 = ''
    tempfile = []
    json_data = request.json
    # if json_data['code'] != 201:
    #     return jsonify({'code': 411,'info':'非法参数'})
    file_uuid = json_data['data']['file']
    is_bw = 'blackAndWhitePrinting' in json_data['data']
    pr_all =  'printAllPages' in json_data['data']
    del_after_print = 'deleteAfterPrinting' in json_data['data']

    file_path = get_file_path(request.cookies.get('dayi-cookie-for-uploads'),file_uuid)
    if file_path == 'Error':
        str1 += '大黑阔？\n'
        return jsonify({'code': 412,'info':str1})
    # tempfile.append(file_path) # 这个是记录在数据库的，不能删

    if ispic(file_path):
                str1+="[dayi]检测到了你上传了图片文件，正在暴力转为pdf\n"
                file_path_tmp=file_path
                file_path=con_pic2pdf(file_path)
                if(file_path == "[error]"):
                    str1+="[error!!]转换pdf失败，你这是图片还是啥？\n"
                    str1+="[error!!]我也不知道咋了这是，给你继续执行了吧\n"
                    file_path=file_path_tmp
                    tempfile.append(file_path)
    
    if file_path.split('.')[-1] in ["doc","docx"]:
        file_path = con_doc2pdf(file_path)# 这里显示Noreturn,这个函数大概率有问题
        tempfile.append(file_path)
    
    if is_bw:
        if file_path.split('.')[-1] == 'txt':
            str1 += "你确定txt还需要转黑白嘛\n"
        elif file_path.split('.')[-1] != 'pdf':
            str1 += "这种格式还不支持转黑白哎\n"
        else :
            str1 += "正在为您转黑白\n"
            file_path_tmp = con2BW(file_path)
            if file_path == 'Error':
                str1 += "转换失败了。。。\n"
                str1 += "要么直接打印彩色？\n"
            else:
                file_path = file_path_tmp
                tempfile.append(file_path)
    
    if not pr_all:
        exe = os.popen('convert -density 300 "{}"[{}] "{}"'.format(file_path,json_data['data']['pageRange'],file_path+"_page.pdf"))
        if exe.read() != '':
            str1 += "截取页数失败了哎，你输入格式对嘛\n"
            str1 += "像这样:\n"
            str1 += "1-5,9,10-20\n"
            if del_after_print:
                del_all_files(tempfile)# 这个是删除中间文件，不包含在数据库的
                file_manager_del(request.cookies.get('dayi-cookie-for-uploads'),file_uuid)
                str1 += "已经为您把处理过程中产生的中间文件删除\n"
            file_path = file_path+"_page.pdf"
            tempfile.append(file_path)
            return jsonify({'code': 413,'info':str1})
    
    print_info=print_file(file_path)#打印
    str1 += print_info

    del_all_files(tempfile)
    if del_after_print:
        file_manager_del(request.cookies.get('dayi-cookie-for-uploads'),file_uuid)
        str1 += "已经为您把处理过程中产生的中间文件删除\n"

    return jsonify({'code': 201,'info':str1})

def del_all_files(files):
    for f in files:
        try:
            os.remove(f)
        except:
            pass

def file_manager_del(dayi_cookie,file):
    cookies = {'dayi-cookie-for-uploads':dayi_cookie}
    r = requests.get("http://127.0.0.1:3000/api/delete_file/".format(file),cookies=cookies)
    if r.json()['code'] != 201 :
        return False
    return True

def get_file_path(dayi_cookie,uuid):
    cookies = {'dayi-cookie-for-uploads':dayi_cookie}
    r = requests.get("http://127.0.0.1:3000/api/get_user_files",cookies=cookies)
    if r.json()['code'] != 201 :
        return 'Error' # No login
    for l in r.json()['data']:
        if l['uuid'] == uuid:
            return l['file_path']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# 执行打印命令,print.py [filepath]
def print_file(filepath):
    run_command="python print.py "+filepath
    ex = os.popen(run_command)
    extext = ex.read()
    ex.close()
    return extext

# 判断是否为图片
def ispic(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[-1] in ALLOWED_PICS
           # fixed: 1 -> -1

# 转换图片为pdf
def con_pic2pdf(allfilepath):
    newfileallpath=""
    image=allfilepath
    newfileallpath=allfilepath+".pdf"
    #from fpdf import FPDF
    #pdf = FPDF()
    #图片为文件路径
    #pdf.add_page()
    #pdf.image(image)
    #pdf.output(newfileallpath, "F")
    
    try:
        image1 = Image.open(allfilepath)
        im1 = image1.convert('RGB')
        im1.save(newfileallpath)
    except:
        newfileallpath="[error]"
    return newfileallpath

# 将文档转化为黑白色
def con2BW(allfilepath):
    exe = os.popen('convert -density 300 {} -type Grayscale {}'.format(allfilepath,allfilepath+"_BW.pdf"))
    if exe.read() != '':
        return 'Error'
    return allfilepath+"_BW.pdf"


# 转换
def con_doc2pdf(allfilepath):
    # wdFormatPDF = 17

    # inputFile = os.path.abspath(allfilepath)
    # outputFile = os.path.abspath(allfilepath+".pdf")
    # word = win32com.client.Dispatch('Word.Application')
    # doc = word.Documents.Open(inputFile)
    # doc.SaveAs(outputFile, FileFormat=wdFormatPDF)
    # doc.Close()
    # word.Quit()
    # return allfilepath+".pdf"
    doc2pdf(allfilepath,allfilepath+".pdf")
    os.remove(allfilepath)
    return allfilepath+".pdf"

# 暂不可用
# def con_ppt2pdf(allfilepath):
#     wdFormatPDF = 32
#     inputFile = os.path.abspath(allfilepath)
#     outputFile = os.path.abspath(allfilepath+".pdf")
#     powerpoint = win32com.client.Dispatch('Powerpoint.Application')
#     ppt = powerpoint.Presentations.Open(inputFile)
#     ppt.SaveAs(outputFile, FileFormat=wdFormatPDF)
#     ppt.Close()
#     powerpoint.Quit()
#     return allfilepath+".pdf"

# # 暂不可用
# def con_xls2pdf(allfilepath):
#     inputFile = os.path.abspath(allfilepath)
#     outputFile = os.path.abspath(allfilepath+".pdf")
#     excel = win32com.client.Dispatch('Excel.Application')
#     xls = excel.Workbooks.Open(inputFile)
#     xls.WorkSheets(1).Select()
#     xls.ActiveSheet.ExportAsFixedFormat(0, outputFile)
#     xls.Close()
#     excel.Quit()
#     return allfilepath+".pdf"


# convert txt to pdf
def con_txt2pdf(allfilepath):
    # pdf = FPDF(unit = 'pt')
    # doc = fitz.open(allfilepath )
    # for i, page in enumerate(doc):
    #     pix = page.get_pixmap(alpha=False)
    #     img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    #     img.save("temp{}.png".format(i))
    #     size = (float(pix.width),float(pix.height))
    #     pdf.add_page(format = size)
    #     pdf.set_xy(0,0)
    #     pdf.set_top_margin(0)
    #     pdf.set_left_margin(0)
    #     pdf.image("temp{}.png".format(i))
    #     os.remove("temp{}.png".format(i))
    # pdf.output(allfilepath+".pdf", "F")
    # F**k you fpdf
    exe = os.popen('convert -density 300 {} {}'.format(allfilepath,allfilepath+".pdf"))
    if exe.read() != '':
        return 'Error'
    try:
        os.remove(allfilepath)
    except:
        pass
    return allfilepath+".pdf"
    return
    

@app.route(AUTH_key+'/uploader',methods=['GET','POST'])
def upload_file_1():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            #filename = secure_filename(file.filename)
            #获得文件名
            filename=file.filename
            
            #获得全路径
            basedir = os.path.abspath(os.path.dirname(__file__))
            #生成随机时间
            randname=time.strftime("%Y.%m.%d.%H.%M.%S", time.localtime())+str(random.randint(1,233333))
            #来个文件名
            file_dir = os.path.join(app.config['UPLOAD_FOLDER'],randname+"_"+filename)
            #try:
            file.save(file_dir)
            all_path=basedir+"\\"+file_dir #全部目录
            str1="上传文件成功! <br>\n"+"文件目录:" +all_path+"<br>正在尝试打印:"+"<br>"

            if ispic(all_path):
                str1+="[dayi]检测到了你上传了图片文件，正在暴力转为pdf<br>\n"
                all_path_tmp=all_path
                all_path=con_pic2pdf(all_path)
                if(all_path=="[error]"):
                    str1+="[error!!]转换pdf失败，你这是图片还是啥？<br>\n"
                    str1+="[error!!]我也不知道咋了这是，给你继续执行了吧<br>\n"
                    all_path=all_path_tmp
            
            if all_path.split('.')[-1] in ["doc","docx"]:
                all_path = con_doc2pdf(all_path)

            # if all_path.split('.')[-1] in ["ppt","pptx"]:
            #     all_path = con_ppt2pdf(all_path)

            # if all_path.split('.')[-1] in ["xls","xlsx"]:
            #     all_path = con_xls2pdf(all_path)
            # 暂时还没实现

            if all_path.split('.')[-1] == "txt":
                all_path = con_txt2pdf(all_path)

            if request.form.get("blackAndWhitePrinting"):
                str1 += "正在将文档转化为黑白<br\n>"
                if all_path.split('.')[-1] != "pdf":
                    str1 += "你上传的格式暂时不支持黑白打印，已经跳过文档处理<br>\n"
                else:
                    all_path = con2BW(all_path)
                    if all_path == 'Error':
                        str1 += '转换失败了<br\n>'
                        return render_template("echo.html",echo_str=str1)

            if not request.form.get("printAllPages"):
                pass
                # 页码选择

            print_info=print_file(all_path)#打印

            if request.form.get("deleteAfterPrinting"):
                os.remove(all_path)

            str1+=print_info
            return render_template("echo.html",echo_str=str1)
        else:
            str1="不合法文件类型！，当前合法类型："
            str1+=str(ALLOWED_EXTENSIONS)
            return render_template("echo.html",echo_str=str1)
    else:
        return render_template('upload.html')



if __name__ == '__main__':
    #app.debug=True

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.run("127.0.0.1","5050",debug=True)