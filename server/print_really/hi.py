import os,logging
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
# 

app = Flask(__name__)
app.logger.setLevel(logging.INFO)


#config 配置信息
from config.configs import AUTH_key
from config.configs import localhost_path

#=============================#
# 导入功能性函数
import plugins.func.func_exec_print_command as func_exec_print_command
#=============================#


#=============================#
# 自动插件加载测试开始
import plugins as plugins #导入插件
def load_plugins():
    # plugins.register_plugins(app)
    plugins.register_api_plugins(app)
# 插件加载测试结束
#=============================#





Convert_path = 'convert'
# 这里填上imagemagick中convert二进制文件的位置
Soffice_path = 'soffice'
# 这里填上libreoffice中soffice二进制文件的位置
# 如果路径中含空格记得用双引号阔上

ALLOWED_EXTENSIONS = set(['docx','doc','ppt','pptx','xls','xlsx','txt', 'pdf', 'jpg', 'gif', 'png', 'jpeg','bmp','csv','odt'])
ALLOWED_PICS=set(['jpg', 'gif', 'png', 'jpeg','bmp'])
UPLOAD_FOLDER = 'uploads'




@app.route(AUTH_key+"/")
def upload_file():
    web_str_time="服务器时间:"+time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
    return render_template("upload.html",str_time=web_str_time)









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
    
    if file_path.split('.')[-1] in ["doc","docx","ppt","pptx","xls","xlsx","csv","odt"]:
        file_path = con_office2pdf(file_path)
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
    
    if not pr_all and file_path.split('.')[-1] == 'pdf':
        exe = os.popen(Convert_path+' -density 300 "{}"[{}] "{}"'.format(file_path,json_data['data']['pageRange'],file_path+"_page.pdf"))
        if exe.read() != '':
            str1 += "截取页数失败了哎，你输入格式对嘛\n"
            str1 += "像这样:\n"
            str1 += "1-5,9,10-20\n"
            if del_after_print:
                del_all_files(tempfile)# 这个是删除中间文件，不包含在数据库的
                str1 += "已经为您把处理过程中产生的中间文件删除\n"
            return jsonify({'code': 413,'info':str1})
        file_path = file_path+"_page.pdf"
        tempfile.append(file_path)
    
    username = request.cookies.get('dayi-cookie-for-uploads')
    print_info=func_exec_print_command.print_file(file_path,username=username)#打印
    str1 += print_info

    del_all_files(tempfile[:-1])
    # TODO: 在打印完后删除最后一个中间文件，上面这里如果直接传递全部会出现打印机找不到文件的bug
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
    r = requests.get(localhost_path+"/api/delete_file/".format(file),cookies=cookies)
    if r.json()['code'] != 201 :
        return False
    return True

def get_file_path(dayi_cookie,uuid):
    cookies = {'dayi-cookie-for-uploads':dayi_cookie}
    r = requests.get(localhost_path+"/api/get_user_files",cookies=cookies)
    if r.json()['code'] != 201 :
        return 'Error' # No login
    for l in r.json()['data']:
        if l['uuid'] == uuid:
            return l['file_path']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS



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
    exe = os.popen(Convert_path + ' -density 300 "{}" -type Grayscale "{}"'.format(allfilepath,allfilepath+"_BW.pdf"))
    if exe.read() != '':
        return 'Error'
    return allfilepath+"_BW.pdf"


# 转换
def con_office2pdf(allfilepath):
    # wdFormatPDF = 17

    # inputFile = os.path.abspath(allfilepath)
    # outputFile = os.path.abspath(allfilepath+".pdf")
    # word = win32com.client.Dispatch('Word.Application')
    # doc = word.Documents.Open(inputFile)
    # doc.SaveAs(outputFile, FileFormat=wdFormatPDF)
    # doc.Close()
    # word.Quit()
    # return allfilepath+".pdf"
    exe = os.popen(Soffice_path + ' --headless --convert-to pdf  "{}" --outdir "{}"'.format(allfilepath,os.path.dirname(allfilepath)))
    if 'convert' not in exe.read():
        return 'Error'
    return allfilepath.split('.')[0]+".pdf"

# 暂不可用
# 已有替代，往上看
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
# 已有替代，往上看
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
    exe = os.popen(Convert_path + ' -density 300 "{}" "{}"'.format(allfilepath,allfilepath+".pdf"))
    if exe.read() != '':
        return 'Error'
    try:
        os.remove(allfilepath)
    except:
        pass
    return allfilepath+".pdf"
    return
    





if __name__ == '__main__':
    #app.debug=True

    app.logger.setLevel(logging.INFO)

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    load_plugins() #加载插件
    
    app.run("0.0.0.0","5050",debug=True)

    