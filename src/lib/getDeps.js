const fs = require('fs')
const path = require('path')

const readCode = require('./readCode.js')


const getDeps = (entry) => {
  const entryFileObject = readCode(entry)

  const deps = [entryFileObject ? entryFileObject : null]

  for (let obj of deps) {

    const dirname = path.dirname(obj.filePath)
    console.log('路径文件夹部分---------------', dirname)

    obj.deps.forEach(relativePath => {
      const truePath = path.join(dirname, relativePath)
      console.log('文件的真实路径：', truePath)
      if (/\.css/.test(truePath)) {
        const content = fs.readFileSync(truePath, 'utf-8')
        const styleCode = `
                var style = document.createElement('style')
                style.innerText = ${JSON.stringify(content).replace(/\\r\\n/g, '')}
                document.head.appendChild(style)
                `
        deps.push({
          filePath: truePath,
          relativePath,
          deps,
          styleCode,
          // id: deps.length > 0 ? deps.length : 0
        })
      } else {
        let obj = readCode(truePath)
        obj.relativePath = relativePath
          // obj.id = deps.length > 0 ? deps.length : 0
        deps.push(obj)
      }
    })
  }
  return deps
}

module.exports = getDeps