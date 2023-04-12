const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  transpileDependencies: true
})