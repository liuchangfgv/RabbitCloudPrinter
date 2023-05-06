module.exports = {
  apps: [
    {
      name: 'python-printing', // 应用程序的名称
      script: 'pdm', // 启动脚本，这里是 pdm 命令
      args: ['run', 'hi.py'], // 脚本参数
      interpreter_args: '-c', // 解释器参数
      env: {
        NODE_ENV: 'production', // 设置环境变量
      },
      windowsHide: true, // 隐藏控制台窗口
    },
  ],
};
