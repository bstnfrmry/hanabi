/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config();

const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const nextSourceMaps = require("@zeit/next-source-maps")();
const optimizedImages = require("next-optimized-images");
const nextOffline = require("next-offline");
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

const offlineConfig = [
  nextOffline,
  {
    transformManifest: manifest => ["/"].concat(manifest), // add the homepage to the cache
    // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
    // turn on the SW in dev mode so that we can actually test it
    generateInDevMode: false,
    workboxOpts: {
      swDest: "static/service-worker.js",
      maximumFileSizeToCacheInBytes: 100000000,
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "https-calls",
            networkTimeoutSeconds: 15,
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
];

module.exports = withPlugins([config, sourceMapsConfig, offlineConfig, optimizedImagesConfig]);
