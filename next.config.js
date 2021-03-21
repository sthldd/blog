const withLessExcludeAntd = require("./next-less.config.js");
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})


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

module.exports = withBundleAnalyzer(withLessExcludeAntd({
    lessLoaderOptions: {
        javascriptEnabled: true,
    }
}))
