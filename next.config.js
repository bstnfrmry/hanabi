/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();

const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const nextSourceMaps = require("@zeit/next-source-maps")();
const optimizedImages = require("next-optimized-images");
const withPlugins = require("next-compose-plugins");

const config = [
  {
    target: "serverless",
    env: {
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
    webpack: (config, { isServer, buildId }) => {
      config.plugins.push(
        new Dotenv({
          path: path.join(__dirname, ".env"),
          systemvars: true,
        })
      );

      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.SENTRY_RELEASE": JSON.stringify(buildId),
        })
      );

      if (!isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser";
      }

      return config;
    },
  },
];

const sourceMapsConfig = [nextSourceMaps];

const optimizedImagesConfig = [
  optimizedImages,
  {
    optimizeImagesInDev: true,
    responsive: {},
  },
];

module.exports = withPlugins([config, sourceMapsConfig, optimizedImagesConfig]);
