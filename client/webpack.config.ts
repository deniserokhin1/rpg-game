import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import type webpack from 'webpack'
import { buildDevServer } from './src/build/buildDevServer'

const port = Number(process.env.port) || 3001
const isDev = process.env.mode === 'development' || !process.env.mode

console.log('isDev:', isDev)

const config: webpack.Configuration = {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
        extensions: ['.ts', '.js', 'json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.png/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
        }),
    ],
    devServer: buildDevServer(port),
    devtool: isDev ? 'source-map' : undefined,
}

export default config
