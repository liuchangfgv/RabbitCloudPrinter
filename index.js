const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

// 创建代理服务器实例
const proxy = httpProxy.createProxyServer({});

// 监听端口
const port = 8080;

// 反向代理 / 和 /api-v2/ 到 Python 应用程序
const pythonHost = 'http://localhost:5050'; // Python 应用程序的主机地址
const pythonPaths = ['/api-v2/*', '/'];

// 反向代理 /api 和 / 到本地主机
const localHost = 'http://localhost:3000'; // 本地主机地址
const localPaths = ['/api/', '/node-index'];

// 创建服务器实例
const server = http.createServer((req, res) => {
  let target = null;
  // 检查请求路径是否匹配 Python 应用程序
  if (pythonPaths.some(path => req.url.startsWith(path))) {
    target = pythonHost;
  }
  // 检查请求路径是否匹配本地主机
  if (localPaths.some(path => req.url.startsWith(path))) {
    target = localHost;
  }

  // 代理主页
  if (req.url === '/' || req.url === '/index.html' || req.url === '/index') {
    fs.readFile('html/index.html', (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error reading index.html file\n');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
    return;
  }

  // 如果请求路径不匹配任何代理目标，则返回 404 错误
  if (!target) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('[Proxy-server]404 Not Found\n');
    return;
  }

  // 转发请求到代理目标
  proxy.web(req, res, {target});

  // 显示实时日志
  console.log(`${new Date().toLocaleString()} : ${req.method} ${req.url} -> ${target} not really code:${res.statusCode}`);
});

// 添加错误处理监听器
proxy.on('error', (error, req, res) => {
  console.log(`${new Date().toLocaleString()} Error proxying ${req.method} ${req.url} to ${req.target}: ${error.message}`);
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end(`${new Date().toLocaleString()}Error proxying ${req.method} ${req.url} to ${req.target}: ${error.message}\n`);
  });
// 启动服务器
server.listen(port, () => {
  console.log(`http://localhost:${port}`)
  console.log(`Proxy server listening on port ${port}`);
});