import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { buildDevServer } from './src/build/buildDevServer'

const config: webpack.Configuration = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            // {
            //     test: [/\.png$/],
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 outputPath: 'assets/',
            //                 publicPath: 'assets/',
            //                 name: '[hash].[ext]',
            //             },
            //         },
            //     ],
            // },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
        }),
    ],
    devServer: buildDevServer(3000),
}

export default config
