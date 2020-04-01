const fs = require('fs')
const uglify = require('uglify-js')

const bundle = function(deps, entry, outPath, compress) {
  let modules = ''
    // 构建函数参数，生成的结构为
    // { './entry.js': function(module, exports, require) { 代码 } }
  deps.forEach(dep => {
      const filePath = dep.relativePath || entry
      modules += `'${filePath}': (
      function (module, exports, require) { ${dep.code} }
    ),`
    })
    // 构建 require 函数，目的是为了获取模块暴露出来的内容
  let result = `
    (function(modules) {
      function require(id) {
        const module = { exports : {} }
        modules[id](module, module.exports, require)
        return module.exports
      }
      require('${entry}')
    })({${modules}})
  `
    //是否压缩代码
  if (compress) {
    result = uglify.minify(result, { mangle: { toplevel: true } }).code
  }
  const outFile = outPath + '/bundle.js';

  // 将压缩后的代码写到出口文件中
  fs.writeFileSync(outFile, result)
  console.log('pack_done_success ==>./bundle.js')
}

module.exports = bundle