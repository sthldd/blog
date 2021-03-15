const withLessExcludeAntd = require("./next-less.config.js");

const withImages = require('next-images')
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
