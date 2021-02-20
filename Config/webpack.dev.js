const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    contentBase: "./dist",
    open: true,
  },
  devtool: "inline-source-map",
  mode: "development",
  output: {
    filename: "bundle.js",
  },
});
