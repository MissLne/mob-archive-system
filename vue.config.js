module.exports = {
  lintOnSave: false,
  configureWebpack: (config) => {
    config.devtool = "source-map"
  },
  css: {
    sourceMap: true,
  },
  devServer: {
    open: true,
    // host: 'localhost',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域配置跨域http://192.168.3.9:8070  
      '/api': {
        // target: 'http://192.168.3.9:8070',
        // target: 'https://test-archive.server.topviewclub.cn',
        target: 'https://test-archive.aliyun.topviewclub.cn',
        // target: 'https://archive-system.aliyun.topviewclub.cn/',
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
