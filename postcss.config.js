module.exports = ({ file }) => {
  let rootValue = 0;
  // Vant的rootValue用16
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
      rootValue = 16
  } else {
      // 自己的样式文件rootValue用32
      rootValue = 32
  }
  return {
      "plugins": {
          "postcss-pxtorem": {
              "rootValue": rootValue,
              "propList": [
                  "*"
              ],
          }
      }
  }
}