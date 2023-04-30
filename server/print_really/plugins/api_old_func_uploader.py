
## 例子例子


# """
# 接口返回信息:
# {code:"201",data:["2021-03-03 19:23"]}
# #显示服务器实时时间
# """


from flask import Flask, jsonify

from config.configs import AUTH_key

import time


# """
# 插件注册
def register_plugin(app):
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

#加载插件
def load_plugin(app):
  register_plugin(app)
