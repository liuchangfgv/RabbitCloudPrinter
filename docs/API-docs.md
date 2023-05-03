# API 开发 接口文档

## Node接口

### /inside_api/check_permission

要求服务器之间要有秘钥，否则无法访问
headers.authorization = 
  
用于检查用户权限
`{ code: "201", info: "鉴权成功" }`

访问失败:
{ code: 401, info: 'Unauthorized' }
