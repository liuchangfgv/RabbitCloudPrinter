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



