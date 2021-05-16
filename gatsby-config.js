module.exports = {
  siteMetadata: {
    title: 'vimcolorschemes',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
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
