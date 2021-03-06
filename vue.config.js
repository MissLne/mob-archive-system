module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域配置跨域http://192.168.3.9:8070
      '/api': {
        // target: 'http://192.168.3.9:8070',
        target: 'https://test-archive.server.topviewclub.cn',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => { }
  }
};
