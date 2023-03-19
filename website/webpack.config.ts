import path from 'path'
import { Configuration, ProgressPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// 添加 devServer 相关类型定义，没有这个 Configuration 中就没有 devServer 配置项了
import 'webpack-dev-server';

// Configuration 是 Webpack 的配置项类型
const conf: Configuration = {
  mode: 'development', // 默认为 production 模式
  entry: './src/index.tsx', // 入口 js 文件，可以配置多个 entry
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出路径
    filename: '[name].[chunkhash].js',  
  },
  devServer: {
    open: true,
    static: 'dist/' // devServer 将从这个位置去获取所有“静态”内容，即 html，js，css 等，这里应当修改为输出目录
  },
  resolve: {
    // webpack 将识别这些后缀文件为 module
    // 这个配置是覆盖原配置的，因此应当给定所有后缀，否则使用第三方库时必然会出问题
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json" , "css"], // 添加 css
    alias: {
      '@': path.join(__dirname, '/src/') // 配置@为 src 目录，使不需要每次都使用相对路径去 import
    }
  },
  module: { // 关于 module 的配置
    rules: [
      {
        test: /\.tsx?$/, // ts 或 tsx
        use: 'ts-loader',
        exclude: /node_modules/ // 排除 node_module 下的 ts 文件
      },
      { 
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html') // 指定 html “模板”文件
    }),
    new ProgressPlugin() // 展示进度
  ],
}

export default conf

