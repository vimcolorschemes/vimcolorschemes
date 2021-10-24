require('dotenv').config({ path: '.env' });

module.exports = {
  siteMetadata: {
    title: 'vimcolorschemes',
    siteUrl: process.env.GATSBY_SITE_URL || 'http://localhost:8000',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [
          process.env.GATSBY_ENABLE_ROBOTS
            ? { userAgent: '*', allow: ['/'] }
            : { userAgent: '*', disallow: ['/'] },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
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
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'vimcolorschemes',
        short_name: 'vimcolorschemes',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#333',
        display: 'standalone',
        icon: 'src/images/logo_square.png',
      },
    },
  ],
};
