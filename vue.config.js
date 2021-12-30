module.exports = {
  configureWebpack: {
    externals: {
      Config: JSON.stringify({
        urls: {
          apiBase: process.env.VUE_APP_URLS_APIBASE,
          jobbadminBase: process.env.VUE_APP_URLS_JOBBADMINBASE,
        },
        authCookie: {
          domain: process.env.VUE_APP_AUTHCOOKIE_DOMAIN,
        },
      }),
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@intlify/vue-i18n-loader");
  },
};
