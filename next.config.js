/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();
const webpack = require("webpack");
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  // next config
};

const sentryWebpackPluginOptions = {
  // sentry config
};

const withPlugins = require("next-compose-plugins");

module.exports = async (phase, { defaultConfig }) => {
  delete defaultConfig["webpackDevMiddleware"];
  delete defaultConfig["configOrigin"];
  delete defaultConfig["target"];
  delete defaultConfig["webpack5"];
  delete defaultConfig.amp["canonicalBase"];

  const localConfig = {
    productionBrowserSourceMaps: true,
    assetPrefix: "/",
    experimental: {},
    images: {
      domains: ["cdn.buymeacoffee.com", "localhost"],
    },
    i18n: {
      locales: ["en", "fr", "es", "it", "nl", "ru", "pt", "de", "sk", "zh"],
      defaultLocale: "en",
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
  };

  return {
    ...withPlugins([], withSentryConfig(moduleExports, sentryWebpackPluginOptions))(phase, {
      config: defaultConfig,
    }),
    ...localConfig,
  };
};
