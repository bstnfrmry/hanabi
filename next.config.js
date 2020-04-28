require("dotenv").config();

const webpack = require('webpack')
const path = require("path");
const Dotenv = require("dotenv-webpack");
const nextSourceMaps = require('@zeit/next-source-maps')()

module.exports = nextSourceMaps({
  target: "serverless",
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(new Dotenv({
      path: path.join(__dirname, ".env"),
      systemvars: true
    }))
    
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.SENTRY_RELEASE': JSON.stringify(buildId),
    }))

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config;
  },
  experimental: {
    reactRefresh: true,
  }
})

