const fs = require('fs')
const uglify = require('uglify-js')

const bundle = function(deps, entry, outPath, compress) {
  let modules = ''
  let moduleId
  deps.forEach(dep => {
    var id = dep && dep.length ? dep.length : 0
    modules = modules + `${id}: function (module, exports, require) {${dep.code}},`
  });
  let result = `
        (function (modules, mType) {
            function require (id) {
                var module = { exports: {}}
                var module_id = require_moduleId(mType, id)
                modules[module_id](module, module.exports, require)
                return module.exports
            }
            require('${entry}')
        })({${modules}},${JSON.stringify(deps)});
        function require_moduleId (typeList, id) {
            var module_id
            typeList.forEach(function (item) {
                if(id === item.filePath || id === item.relativePath){
                    module_id = item.id
                }
            })
            return module_id
        }
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