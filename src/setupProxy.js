// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/api/nothing', {
      target: 'http://localhost:1234', // 测试环境
      changeOrigin: true
    })
  )
}
