const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: 'http://localhost:1234', // 测试环境
            changeOrigin: true,
        })
    )
}