const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs')
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser');

const server_port  = 3000;


//自写lib
const mysql_lib = require('./lib/mysql-lib');




app.listen(server_port, () => {
  console.log('http://0.0.0.0:'+server_port);
  console.log(`listening on port [${server_port}]`);
  console.log(`http://localhost:${server_port}`);
});