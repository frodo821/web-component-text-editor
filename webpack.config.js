const path = require('path');

const MODE = process.env.NODE_ENV || "development";
const sourceMapEnabled = MODE == "development";

module.exports = {
  mode: MODE,
  entry: './src/index.ts',
  output: {
    filename: 'text-editor-element.js',
    path: __dirname + '/dist',
    library: 'TextEditorElement',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      __dirname + '/dist',
      'node_modules'
    ],
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {loader: "babel-loader"},
          {loader: "ts-loader"}
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {loader: "raw-loader"},
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: sourceMapEnabled,
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: sourceMapEnabled
            }
          }
        ]
      }
    ]
  }
};
