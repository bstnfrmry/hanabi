/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();

const webpack = require("webpack");
const withPlugins = require("next-compose-plugins");

const config = [
  {
    target: "serverless",
    i18n: {
      locales: ["en", "fr", "es", "it", "nl", "ru", "pt", "de", "sk", "zh"],
      defaultLocale: "en",
    },
    images: {
      domains: ["cdn.buymeacoffee.com"],
    },
    webpack: (config, { isServer, buildId }) => {
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

module.exports = withPlugins([config]);
