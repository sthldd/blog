const withLessExcludeAntd = require("./next-less.config.js");
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  webpack(config, options) {
    return config
  }
})
module.exports = withImages({
  webpack(config, options) {
    return config
  }
})

module.exports = withLessExcludeAntd({
    lessLoaderOptions: {
        javascriptEnabled: true,
    }
})
