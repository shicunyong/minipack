const getDeps = require('./lib/getDeps')
const bundle = require('./lib/bundle')
const path = require('path')

const pack = function(config) {
    if (!config.entryPath || !config.outPath) {
      throw new Error('minipack需要配置入口和出口路径')
      return
    }
    let entryPath = config.entryPath
    let outPath = config.outPath
    let compress = config.compress || false

    let deps = getDeps(entryPath)
    bundle(deps, entryPath, outPath, compress)

  }
  //本地测试pack函数是否可用
const currentPath = path.resolve('./', '../dist');
pack({
  entryPath: './testCode/index.js',
  outPath: currentPath,
  compress: false
})

module.exports = pack