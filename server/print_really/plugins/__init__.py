# from plugins import api_time_plugin
# from plugins import api_show_print_real_time_info
# def register_plugins(app):
#   time_plugin.load_plugin(app)
#   api_show_print_real_time_info.load_plugin(app)


# 插件加载器
import logging
import importlib
import os


#加载以api开头的文件
def register_api_plugins(app):
    plugins_dir = os.path.dirname(__file__)
    for filename in os.listdir(plugins_dir):
        if filename.startswith('api_') and filename.endswith('.py'):
            plugin_name = filename[:-3]  # Remove the '.py' extension
            try:
                plugin_module = importlib.import_module(f'plugins.{plugin_name}')
                plugin_module.load_plugin(app)
                app.logger.info(f'[{plugin_name}] 插件加载成功')
            except Exception as e:
                app.logger.error(f'[{plugin_name}] 插件加载失败: {e}')
