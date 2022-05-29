// const NodemonPlugin = require("nodemon-webpack-plugin"); // Ding
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode:"production",
  entry: "./src/script.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[hash].main.js",
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(css|sass)$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // plugins: [new NodemonPlugin()],

  plugins: [
    new HtmlWebpackPlugin({
      title: 'e-ticket',
      filename: 'index.html',
      template: './src/index.html'
    }),
    //new NodemonPlugin()
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },


};
