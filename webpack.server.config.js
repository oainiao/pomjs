var path = require('path')
var webpack = require('webpack')

module.exports = {
    target: 'node', // !different

    entry: {index: './pages/index/server-entry.js'},
    output: {
        path: path.resolve(__dirname, './dist/'),
        publicPath: '/dist/',
        filename: "[name].bundle.js",
        libraryTarget: 'commonjs2', // !different
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    // externals: {
    //   vue: 'Vue'
    // },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}
