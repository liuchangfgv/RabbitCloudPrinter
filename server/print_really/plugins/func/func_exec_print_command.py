import os
import aiohttp
import asyncio
import requests

import plugins.func.func_get_server_config as server_config 

async def insert_user_print_history(userName, printerId):
  async with aiohttp.ClientSession() as session:
      url = "http://localhost:{}/inside_api/insert_user_print_history".format(server_config.get_server_port())
      headers = {"Authorization": server_config.get_server_api_key()}
      data = {"userName": userName, "printerId": printerId}
      async with session.post(url, headers=headers, json=data) as response:
        result = await response.json()
        return result





def check(username):
    url = "http://localhost:{}/inside_api/check_permission/{}".format(server_config.get_server_port(), username)
    headers = {"Authorization": server_config.get_server_api_key()}
    response = requests.get(url, headers=headers)
    print(response.text)
    result = response.json()
    if result['code'] == 201:
        return result['info']
    else:
        return result['info']



# 异步访问后端API
async def main(filepath,username,printerId):
    result = await insert_user_print_history(username, 123)
    return result

# 打印文件
def print_file(filepath,username = "what",printerId = -1):
    async def runner(filepath,username,printerId):
        await main(filepath,username,printerId)
    # 执行打印命令

    if not check(username):
        return "<br><font color=red>\n您的权限不足，无法打印</font><br>\n"

    run_command = 'pdm run ./plugins/func/print_cn.py \"{}\" \"{}\" '.format(filepath,printerId)
    ex = os.popen(run_command)
    extext = ex.read()
    ex.close()

    #执行异步访问API
    
    return extext

    
