import os
from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import time,random,os
from PIL import Image

app = Flask(__name__)

#config
AUTH_key="/Auth_dayi_Owo_key" 
ALLOWED_EXTENSIONS = set(['docx','doc','ppt','pptx','xls','xlsx','txt', 'pdf', 'jpg', 'gif', 'png', 'jpeg','bmp'])
ALLOWED_PICS=set(['jpg', 'gif', 'png', 'jpeg','bmp'])
UPLOAD_FOLDER = 'uploads'


@app.route(AUTH_key+"/")
def upload_file():
    web_str_time="服务器时间:"+time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
    return render_template("upload.html",str_time=web_str_time)

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
           filename.rsplit('.', 1)[1] in ALLOWED_PICS

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
            
            print_info=print_file(all_path)#打印
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