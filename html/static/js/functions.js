//部分js放在这里

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


function getPrintInfo() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data.code == '201') {
          // 更新页面上的打印信息
          var printInfoDiv = document.getElementById('print-info');
          printInfoDiv.innerHTML = '';
          for (var i = 0; i < data.data.length; i++) {
            var p = document.createElement('p');
            p.innerText = data.data[i];
            printInfoDiv.appendChild(p);
          }
        } else {
          var printInfoDiv = document.getElementById('print-info');
          printInfoDiv.innerHTML =
            '请求出现错误，服务器可能出现错误，请稍重试..';
        }
      } else {
        var printInfoDiv = document.getElementById('print-info');
        printInfoDiv.innerHTML = '请求失败，请稍重试..';
        printInfoDiv.innerHTML = '请求出现错误，服务器可能出现错误，请稍重试..';
      }
    }
  };
  xhr.onerror = function () {
    var printInfoDiv = document.getElementById('print-info');
    printInfoDiv.innerHTML = '请求出现错误，服务器可能出现错误，请稍重试..';
  };
  xhr.open('GET', '/api-v2/realtime-print-info', true);
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



const selectedFiles = [];
function fetchUserFiles() {
  fetch('/api/get_user_files', { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
      var index = 0;
      if (data.code == 201) {
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
          indexCell.innerText = index + 1  // <-- 添加序号

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

//获得打印机列表
async function getPrinterList() {
  const response = await fetch('/api-v2/get-printers');
  const data = await response.json();
  return data.data;
}

//默认打印机
async function getDefaultPrinter() {
  const response = await fetch('/api-v2/get-default-printer');
  const data = await response.json();
  return data.data;
}

async function displayPrinterList() {
  const printers = await getPrinterList();
  const defaultPrinter = await getDefaultPrinter();
  const printerListContainer = document.querySelector('#printer-list');
  printers.forEach((printer) => {
    const option = document.createElement('option');
    option.value = printer;
    option.text = printer;
    if (printer === defaultPrinter) {
      option.selected = true;
      const defaultPrinterLabel = document.createElement('label');
      defaultPrinterLabel.innerHTML = '（默认打印机）';
      printerListContainer.appendChild(defaultPrinterLabel);
    }
    printerListContainer.appendChild(option);
  });
}



