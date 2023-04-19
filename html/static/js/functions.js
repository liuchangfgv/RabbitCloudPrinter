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


//NODE-后端服务器测试
function checkServerStatus() {
    const st = document.getElementById('node-status')
    fetch('/api/test').then(response => response.json())
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
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var data = JSON.parse(this.responseText);
          if (data.code == "201") {
            // 更新页面上的打印信息
            var printInfoDiv = document.getElementById("print-info");
            printInfoDiv.innerHTML = "";
            for (var i = 0; i < data.data.length; i++) {
              var p = document.createElement("p");
              p.innerText = data.data[i];
              printInfoDiv.appendChild(p);
            }
          } else {
            var printInfoDiv = document.getElementById("print-info");
            printInfoDiv.innerHTML = "请求出现错误，服务器可能出现错误，请稍重试..";
          }
        } else {
          var printInfoDiv = document.getElementById("print-info");
          printInfoDiv.innerHTML = "请求失败，请稍重试..";
          printInfoDiv.innerHTML = "请求出现错误，服务器可能出现错误，请稍重试..";
        }
      }
    };
    xhr.onerror = function() {
      var printInfoDiv = document.getElementById("print-info");
      printInfoDiv.innerHTML = "请求出现错误，服务器可能出现错误，请稍重试..";
    };
    xhr.open("GET", "/api-v2/realtime-print-info", true);
    xhr.send();
  }

//获得时间
function getCurrentTime() {
    const timeDiv = document.getElementById("dayi-time");
    fetch("./api-v2/time")
      .then(response => response.json())
      .then(data => {
        const time = data.data[0];
        timeDiv.innerText = time;
      })
      .catch(error => {
        console.error(error);
        timeDiv.innerText = "后端服务器未正常响应实时时间";
      });
  }
  

  
  