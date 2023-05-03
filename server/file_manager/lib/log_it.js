const colors = require('colors');

function log_info(str1) {
  str1 = `[${new Date().toLocaleString()}] - INFO - ${str1}`
  str1 = str1.green
  console.log(str1)
}

function log_error(str1) {
  console.log(`[${new Date().toLocaleString().red}] - ERR - ${str1}`)
}

exports.log_info = log_info
exports.info = log_info
exports.log_error = log_error
exports.error = log_error
