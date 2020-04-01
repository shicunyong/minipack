const getDeps = require('./lib/getDeps')
const bundle = require('./lib/bundle')

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

module.exports = pack