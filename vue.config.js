const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/the-little-apple/" : "/",
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  transpileDependencies: true
})