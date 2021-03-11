const cssLoaderConfig = require('@zeit/next-css/css-loader-config')

module.exports = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            if (!options.defaultLoaders) {
                throw new Error(
                    'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
                )
            }
            const { dev, isServer } = options
            const {
                cssLoaderOptions,
                postcssLoaderOptions,
                lessLoaderOptions = {}
            } = nextConfig

            // use Object for `test` to bypass NextJS detection
            // so that it will keep CSS and SASS support.
            config.module.rules.push({
                test: {
                    and: [/\.less$/],
                    not: [/\.module\.less$/]
                },
                use: cssLoaderConfig(config, {
                    extensions: ['less'],
                    cssModules: false,
                    cssLoaderOptions,
                    postcssLoaderOptions,
                    dev,
                    isServer,
                    loaders: [
                        {
                            loader: 'less-loader',
                            options: lessLoaderOptions
                        }
                    ]
                })
            })

            config.module.rules.push({
                test: /\.module\.less$/,
                use: cssLoaderConfig(config, {
                    extensions: ['module.less'],
                    cssModules: true,
                    cssLoaderOptions,
                    postcssLoaderOptions,
                    dev,
                    isServer,
                    loaders: [
                        {
                            loader: 'less-loader',
                            options: lessLoaderOptions
                        }
                    ]
                })
            })

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options)
            }

            return config
        }
    })
}