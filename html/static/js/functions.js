//部分js放在这里

var printerName = "" //当前选择的打印机名字
var selectedFiles = [];

// 下载文件
function downloadFile(uuid) {
  window.location.href = '/api/download_file/' + uuid;
}
// 格式化文件大小
function formatFileSize(size) {
  if (size < 1024) {
    return size + ' KB'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' GB'
  }
}


// NODE-后端服务器测试
function checkServerStatus() {
  const st = document.getElementById('node-status')
  fetch('/api/test')
    .then(response => response.json())
    .then(data => {
      if (data.code == 201) {
        st.innerText = '文件服务器运行正常 √';
      } else {
        st.innerText = '文件服务器运行异常 ×';
      }
    })
    .catch(error => {
      st.innerText = '请求服务器出错 ×，文件服务器运行异常 ×';
    });
}


//获得实时打印机信息
function getPrintInfo() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var data = JSON.parse(this.responseText);

        var printInfoDiv = document.getElementById('print-info');


        if (data.code == '201') {
          // 更新页面上的打印信息
          printInfoDiv.innerHTML = '';
          printInfoDiv.innerHTML = "当前打印机:" + printerName + "<br>";

          for (var i = 0; i < data.data.length; i++) {
            var p = document.createElement('p');
            p.innerText = data.data[i];
            printInfoDiv.appendChild(p);
          }
          if (data.data.length == 0) {
            var p = document.createElement('p');
            p.innerText = "当前打印机没有需要等待的文件哦~";
            printInfoDiv.appendChild(p);
          }
        } else {
          printInfoDiv.innerHTML = '请求出现错误，服务器可能出现错误，请稍重试..';
        }
      } else {
        var printInfoDiv = document.getElementById('print-info');
        printInfoDiv.innerHTML = '请求失败，请稍重试..';
      }
    }
  };
  xhr.onerror = function () {
    var printInfoDiv = document.getElementById('print-info');
    printInfoDiv.innerHTML = '请求出现错误，服务器可能出现错误，请稍重试..';
  };

  xhr.open('GET', '/api-v2/realtime-print-info?printer_name=' + printerName, true);
  xhr.send();
}


//获得时间
function getCurrentTime() {
  const timeDiv = document.getElementById('dayi-time');
  fetch('./api-v2/time')
    .then(response => response.json())
    .then(data => {
      const time = data.data[0];
      timeDiv.innerText = time;
    })
    .catch(error => {
      console.error(error);
      timeDiv.innerText = '后端服务器未正常响应实时时间';
    });
}


// 删除文件
function deleteFile(uuid) {
  if (!confirm('确定要删除该文件吗？')) {
    return
  }
  fetch('/api/delete_file/' + uuid, { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      if (data.code == 201) {
        fetchUserFiles()
      } else if (data.code == 401) {
        console.log('[dayi-error]错误')
        console.log(data)
        // window.location.replace('/login.html')
      } else {
        alert(data.info)
      }
    })
    .catch(error => console.error(error))
}




function fetchUserFiles() {
  fetch('/api/get_user_files', { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      var index = 0;
      if (data.code == 201) {
        var file_index = 0;
        const fileList = document.getElementById('file-list')
        fileList.innerHTML = ''
        const files = data.data
        files.forEach(file => {
          const row = document.createElement('tr')

          //文件大小
          const sizeCell = document.createElement('td')
          sizeCell.innerText = formatFileSize(file.file_size)

          // //文件路径
          // const pathCell = document.createElement('td')
          // pathCell.innerText = file.file_path

          // 文件UUID
          const uuidCell = document.createElement('td')
          uuidCell.innerText = file.uuid

          //文件序号
          const indexCell = document.createElement('td')
          indexCell.innerText = ++file_index  // <-- 添加序号

          //文件选择
          const selected_file_cell = document.createElement('td')
          const selected_file_Btn = document.createElement('button')
          selected_file_Btn.innerText = '选择我'

          selected_file_cell.appendChild(selected_file_Btn)
          selected_file_Btn.classList.add('btn', 'btn-info')
          selected_file_Btn.addEventListener('click', () => {
            selectedUUID = file.uuid
            selectedFilePath = file.file_path
            //显示当前的UUID
            document.getElementById('selected-file-uuid').innerText =
              '您选择的文件UUID为:' + selectedUUID +
              '\n文件名、文件路径:' + selectedFilePath;
            console.log(selectedUUID)

            // 高亮显示该行
            const rows = document.querySelectorAll('#file-list tr')
            rows.forEach(row => row.classList.remove('selected'))
            row.classList.add('selected')
          })
          selected_file_cell.classList.add('selected')



          //删除按钮
          const deleteCell = document.createElement('td')
          const deleteBtn = document.createElement('button')
          deleteBtn.innerText = '删除'
          deleteBtn.classList.add('btn', 'btn-danger')
          deleteBtn.addEventListener('click', () => { deleteFile(file.uuid) })
          deleteCell.appendChild(deleteBtn)


          //文件名
          const filenameCell = document.createElement('td')
          filenameCell.innerText = file.file_name

          // ...
          //下载按钮
          const downloadCell = document.createElement('td')
          const downloadBtn = document.createElement('button')
          downloadBtn.innerText = '下载'
          downloadCell.appendChild(downloadBtn)  // <-- 添加下载按钮
          downloadBtn.classList.add('btn', 'btn-success')
          downloadBtn.addEventListener('click', () => { downloadFile(file.uuid) })
          row.appendChild(downloadCell)
          // ...

          row.appendChild(indexCell)  //序号

          row.appendChild(filenameCell)
          row.appendChild(sizeCell)
          // row.appendChild(pathCell)
          row.appendChild(uuidCell)
          row.appendChild(selected_file_cell)
          row.appendChild(downloadCell)
          row.appendChild(deleteCell)

          fileList.appendChild(row)
        })
      } else if (data.code == 401) {
        console.log('[dayi-error]用户未登录')
        // 用户未登录，跳转到登录页面
        // window.location.replace('/login.html')
      } else {
        alert(data.info)
      }
    })
    .catch(error => console.error(error))
}

// 获取打印机列表
async function getPrinterList() {
  const response = await fetch('/api-v2/get-printers');
  const data = await response.json();
  return data.data;
}

// 获取默认打印机
async function getDefaultPrinter() {
  const response = await fetch('/api-v2/get-default-printer');
  const data = await response.json();

  // 当前选择的打印机
  printerName = data.data;
  return data.data;
}

// 显示打印机列表
async function displayPrinterList() {
  const printers = await getPrinterList();
  const defaultPrinter = await getDefaultPrinter();
  const printerListContainer = document.querySelector('#printer-list');

  // 添加其它打印机选项
  printers.forEach((printer) => {
    if (printer !== defaultPrinter) {
      const option = document.createElement('option');
      option.value = printer;
      option.text = printer;
      printerListContainer.appendChild(option);
    }
  });

  const defaultOption = document.createElement('option');
  defaultOption.value = defaultPrinter;
  defaultOption.text = defaultPrinter;
  defaultOption.selected = true;
  printerListContainer.insertBefore(defaultOption, printerListContainer.firstChild);
}


function changePrinter() {
  const printerListContainer = document.querySelector('#printer-list');
  const selectedPrinter = printerListContainer.value;
  printerName = selectedPrinter;
}

// 退出登录

function log_out() {
  mdui.confirm('确认要退出登录吗？', '提示', function() {
    run_log_out();
  });
}


async function run_log_out() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/logout');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var out_str = data['info'];
        var title_str = '<font color="green">退出登录成功</font>';
        mdui.alert(out_str, title_str, function () {  
          
        });
        
        //等待3秒后自动刷新页面
        setTimeout(function () {
          window.location.reload(); // 刷新页面
        }, 3000);
        
      } else {
        var title_str = '<font color="red">退出登录失败</font>';
        mdui.alert('<font color="red">退出登录失败</font>', title_str, function () { });
      }
    }
  };
  xhr.send();
}


// 获得用户权限等级
function get_user_level() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      document.getElementById('user-permission-level').innerText = data['permission'];
    }
  };
  xhr.open('GET', '/api/get_permission');
  xhr.send();
}
// 获得用户权限等级

// 切换用户
function switch_user(){
  // 显示设置用户名的对话框
  var dialog = new mdui.Dialog('#username-dialog', { modal: true });
  dialog.open();
}

function switch_user_on_click(){
  document.getElementById('set-username-btn').addEventListener('click', function() {
    var username = document.getElementById('username-input').value;
    if (username) {
      // 设置cookie
      document.cookie = "dayi-cookie-for-uploads=" + encodeURIComponent(username) + "; path=/";
      var dialog = new mdui.Dialog('#username-dialog', { modal: true });
      dialog.close();
      location.reload();
    }
  });
  
}

// function switch_user_on_click(){
//   document.getElementById('set-username-btn').addEventListener('click', function() {
//     var username = document.getElementById('username-input').value;
//     if (username) {
//       // 发送登录请求
//       var xhr = new XMLHttpRequest();
//       xhr.open('GET', '/api/login/' + encodeURIComponent(username));
//       xhr.setRequestHeader('Content-Type', 'application/json');
//       xhr.onreadystatechange = function() {
//         if (xhr.readyState === 4) {
//           if (xhr.status === 200) {
//             var data = JSON.parse(xhr.responseText);
//             if (data.code === 201) {
//               // 显示用户信息
//               var user_info = data.user_info;
//               var dialog = new mdui.Dialog('#login-success-dialog', { modal: true });
//               document.getElementById('user-name-info').innerText = user_info.name;
//               document.getElementById('user-permission-info').innerText = user_info.permission;
//               dialog.open();
//               // 设置cookie
//               document.cookie = "dayi-cookie-for-uploads=" + encodeURIComponent(user_info.user_name) + "; path=/";
//               // 刷新页面
//               location.reload();
//             } else {
//               mdui.alert(data.info, '登录失败', function() {});
//             }
//           } else {
//             mdui.alert('服务器错误，登录失败', '登录失败', function() {});
//           }
//         }
//       };
//       xhr.send();
//     }
//   });
// }





// 弹出授权对话框
function showGrantDialog() {
  var dialog = new mdui.Dialog('#grant-dialog');
  dialog.open();
}

// 授权操作
function grantPermission() {
  // 获取授权用户名和权限等级
  var targetUser = document.getElementById('target_user').value.trim();
  var permission = parseInt(document.getElementById('permission').value.trim());

  // 发送授权请求
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/grant_permission');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        if (data.code === 201) {
          mdui.alert(data.info, '授权成功', function() {});
        } else {
          mdui.alert(data.info, '授权失败', function() {});
        }
      } else {
        mdui.alert('服务器错误，授权失败', '授权失败', function() {});
      }
    }
  };
  xhr.send(JSON.stringify({ target_user: targetUser, permission: permission }));
}
