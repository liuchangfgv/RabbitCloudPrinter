# Rabbit Cloud Printer

## TODO

- [X] 前端-选择文件-发送打印请求
- [x] 前端-精简显示内容
- [X] 实时显示打印进度 
- [x] 黑白
- [x] 打印完请求删除文件
- [x] HTML文件太大，需要分割
- [ ] 生成文件预览图
- [x] 获得打印机列表
- [x] 支持选择打印机
- [x] 页码选择
- [x] 文档-安装文档
- [x] UI 美化
- [x] 启动脚本
- [x] 安装脚本
- [ ] 模板打印
- [x] 用户权限管理
- [x] 用户自助子设备授予权限
- [x] 打印统计
- [ ] 显示服务器系统状态信息

## 实现上的功能

- 无感登录
- 可以无感切换mysql与sqlite3



## 图片

![image-20230503231300834](https://p.dabbit.net/blog/pic_bed/2023/05/a2f6ed77c57cfc5e_202305032313912.png)



![image-20230503231309458](https://p.dabbit.net/blog/pic_bed/2023/05/77d019184e526447_202305032313527.png)

# 安装文档

## 环境需要

1. 能打开pdf的软件
2. 能打开doc,xls,ppt之类的软件（如果没有，则暂时不能打印doc，xls等），也推荐LibreOffice
3. node 18+
4. python 3.7 +
5. windows
6. 已经装好的打印机驱动
7. 确保 python，node已经在环境目录内
8. 8080端口，3000,5050端口没有被占用


## 安装

1. 解压项目文件，最好不要有中文目录

2. 运行install_server.cmd

   有一个包可能下载比较慢

   ![image-20230419213044166](https://p.dabbit.net/blog/pic_bed/2023/04/1af78fed4dc2ab27_202304192130269.png)


## 运行 

1. 运行run_server.cmd
2. 服务器已经在8080端口运行。
