const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },

  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'softylines',
      project: 'softyevent',
      url: 'https://sentry.softylines.com',
    }),
  ],
  devtool: 'source-map',
};
