// 引入fs 用来读取文件
const fs = require('fs')

// 引用babylon 用来解析es6以上版本的代码并解析成AST
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

/* 流程
 * 1. 读取js的文件
 * 2. 通过引用babylon 生成AST, 并将AST打印出来
 * 3. 利用babel 将AST转换成ES5的写法
 */

const filePath = './index.js'

const content = fs.readFileSync(filePath, 'utf-8')
const ast = babylon.parse(content, {
  sourceType: 'module'
})

console.log(ast, '------------AST-------------')

// deps中包含入口文件所依赖的文件 ['./add]
const deps = [];

traverse(ast, {
  ImportDeclaration: ({ node }) => {
    deps.push(node.source.value)
  }
})

console.log(deps, '=========')

const { code } = transformFromAst(ast, null, { presets: ['env'] })

// code中可以看到箭头函数被转换成function的形式
console.log(code, '--------------code-------------')