// # import PyPDF2
// # from PIL import Image

// # # 打开 PDF 文件
// # pdf = PyPDF2.PdfReader(open('input.pdf', 'rb'))
// # output = PyPDF2.PdfWriter()

// # # 遍历每一页
// # for page in pdf.pages:
// #     # 将 PDF 页面转换为 PIL 图像
// #     pil_image = page.toImage()
    
// #     # 将 PIL 图像转换为黑白模式
// #     bw_image = pil_image.convert('1')
    
// #     # 将黑白图像转换回 PDF 页面
// #     output_page = PyPDF2.pdf.PageObject.createBlankPage(None, page.mediaBox.getWidth(), page.mediaBox.getHeight())
// #     output_page.mergeScaledTranslatedPage(bw_image, bw_image.size[0], bw_image.size[1], 0, 0)
    
// #     # 将处理后的页面添加到输出 PDF 中
// #     output.addPage(output_page)

// # # 保存输出 PDF 文件
// # with open('output.pdf', 'wb') as f:
// #     output.write(f)


const { exec } = require('child_process');

const inputPdf = 'input.pdf';
const outputPdf = 'output.pdf';

exec(`convert -density 300 "${inputPdf}" -type Grayscale "${outputPdf}"`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});


//  why not use python to do this?
//  bcs, python is rubbit