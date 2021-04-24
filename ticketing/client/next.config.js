module.exports = {
  webpackDevMiddleware: config => {
    config.wathOptions.poll = 300;
    return config;
  }
};