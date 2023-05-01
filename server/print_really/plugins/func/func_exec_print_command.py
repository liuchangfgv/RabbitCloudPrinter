# 执行打印命令,print.py [filepath]
def print_file(filepath):
    run_command="pdm run print_cn.py "+filepath
    ex = os.popen(run_command)
    extext = ex.read()
    ex.close()
    return extext



