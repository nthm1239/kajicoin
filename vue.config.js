module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir: process.env.VUE_APP_BUILD_PATH,
  devServer:{
    proxy: {
      "/kajicoins": {
        target: "http://localhost:3000"
      }
    }
  }
}