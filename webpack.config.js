let webpack = require("webpack");
let autoprefixer = require("autoprefixer");
module.exports = {
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader?modules!postcss-loader"},
            {test: /\.scss$/, loader: "style-loader!css-loader?modules!postcss-loader!sass-loader"},
            {test: /\.png$/, loader: "url-loader?limit=100000"},
            {test: /\.jpg$/, loader: "file-loader"},
            // the url-loader uses DataUrls.
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            // the file-loader emits files.
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"],
                    plugins: ["syntax-async-functions", "transform-regenerator", "transform-class-properties"]
                }
            }
        ]
    },
    postcss: [autoprefixer()],
    output: {
        filename: "bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};