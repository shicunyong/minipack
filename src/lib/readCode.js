const traverse = require('babel-traverse').default

function readCode(filePath) {
  // 文件路径必传
  if (!filePath) {
    throw new Error('No entry file path')
    return
  }
  // 新建一个数组用来保留文件中依赖的文件
  const deps = []
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babylon.parse(content, { sourceType: 'module' })
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value)
    }
  })
  const { code } = transformFromAst(ast, null, { presets: ['env'] })

  return {
    filePath,
    deps,
    code,
    // id: deps.length > 0 ? deps.length - 1 : 0
  }
}

export default readCode;