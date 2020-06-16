module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '^/api': {
        // 要跨域的域名
        target: 'http://localhost:8080',
        // 是否启用websockets
        ws: true,
        // 是否允许跨越
        changeOrigin: true,
        pathRewrite: {
          // 将你的地址代理位这个 /api 接下来请求时就使用这个/api 来代替你的地址
          '^/api': ''
        }
      }
    }
  }
}
