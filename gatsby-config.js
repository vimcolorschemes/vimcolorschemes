require('dotenv').config({ path: '.env' });

module.exports = {
  siteMetadata: {
    title: 'vimcolorschemes',
    siteUrl: process.env.GATSBY_SITE_URL || 'http://localhost:8000',
    description:
      'vimcolorschemes is the ultimate resource for vim users to find the perfect color scheme for their favorite development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation.',
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
        additionalData: `
          @use 'sass:math';
          @import '${__dirname}/src/styles/mixins';
        `,
      },
    },
    {
      resolve: 'gatsby-source-mongodb',
      options: {
        connectionString:
          process.env.DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017',
        dbName: process.env.DATABASE_NAME || 'vimcolorschemes',
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
