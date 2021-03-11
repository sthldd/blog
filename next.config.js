const withLessExcludeAntd = require("./next-less.config.js");

module.exports = withLessExcludeAntd({
    lessLoaderOptions: {
        javascriptEnabled: true,
    }
})
