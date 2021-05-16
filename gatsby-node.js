const path = require('path');

exports.onCreateWebpackConfig = function ({ actions }) {
  actions.setWebpackConfig({
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  });
};
