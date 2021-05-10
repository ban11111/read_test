import download from 'downloadjs'

export default function downloadFile(resp) {
  // 提取文件名
  const fileName = resp.headers['content-disposition'].match(/filename=(.*)/)[1]
  const contentType = resp.headers['content-type']
  console.log('???????????????', fileName, contentType)
  download(resp.data, fileName, contentType)
}
