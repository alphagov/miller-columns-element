module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      '@open-wc/karma-esm'
    ],
    files: ['../dist/index.umd.js', 'test.js'],
    preprocessors: {
      'test.js': ['webpack']
    },
    webpack: {
      mode: 'development'
    },
    reporters: ['mocha'],
    port: 9876,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    esm: {
      nodeResolve: true
    }
  })
}
