/* eslint-disable @typescript-eslint/no-var-requires */
// git 最近一次提交记录 修改的测试
const fs = require('fs')
const { table } = require('table')
const exec = require('child_process').exec

;(async () => {
  try {
    const rep = await fs.readFileSync('./lastgitcommit.text')
    const nstr = rep.toString().split('\n')
    const fin = nstr.slice(6, nstr.length - 1)
    const tems = []
    for (let i = 0; i < fin.length; i++) {
      if (
        !fin[i].includes('.scss') &&
        !fin[i].includes('/api/') &&
        !fin[i].includes('interface') &&
        !fin[i].includes('.test.') &&
        fin[i].includes('src')
      ) {
        const src = './coverage/lcov-report/' + fin[i] + '.html'
        let content
        try {
          // 如果读取文件
          content = (await fs.readFileSync(src)).toString().split('\n')[27]
        } catch (error) {
          content = ''
          console.log(error)
          // exec('echo error > temp.txt')
        }
        const branchRadio = content && content.match(/<span class="strong">(.+)<\/span>/)[1]
        tems.push([fin[i], branchRadio])
      }
    }
    console.log(table([['本次commit 修改的文件', '修改文件的分支覆盖率'], ...tems]))
    for (let j = 0; j < tems.length; j++) {
      if (tems[j][1].replace('%', '') < 0) {
        // eslint-disable-next-line no-throw-literal
        exec('echo error > temp.txt')
        return
      }
    }
  } catch (error) {
    console.log(error, 'x')
  }
})()

// check 单元测试