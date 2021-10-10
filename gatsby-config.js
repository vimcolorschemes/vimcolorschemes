require('dotenv').config({ path: '.env' });

module.exports = {
  siteMetadata: {
    title: 'vimcolorschemes',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        additionalData: `@import '${__dirname}/src/styles/global';`,
      },
    },
    {
      resolve: 'gatsby-source-mongodb',
      options: {
        connectionString:
          process.env.GATSBY_DATABASE_CONNECTION_STRING ||
          'mongodb://localhost:27017',
        dbName: process.env.GATSBY_DATABASE_NAME || 'vimcolorschemes',
        collection: ['repositories'],
      },
    },
  ],
};
