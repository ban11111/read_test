// eslint-disable-next-line @typescript-eslint/no-var-requires
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
module.exports = {
  style: {
    postcss: {
      env: {
        stage: 0 /* Any valid stages: https://cssdb.org/#staging-process. */,
        features: {
          /* Any CSS features: https://preset-env.cssdb.org/features. */
        }
      }
    }
  },
  // devServer: {
  //   proxy: {
  //     '/api': 'http://172.16.0.30:32004',
  //     '/collect': 'http://172.16.0.30:32011',
  //     '/ncollect': 'http://172.16.0.30:32012',
  //     '/assert': 'http://172.16.0.30:32004',
  //     '/appbackend': 'http://172.16.0.30:30000'
  //   }
  // },
  webpack: {
    plugins: [new HardSourceWebpackPlugin()]
  }
}
