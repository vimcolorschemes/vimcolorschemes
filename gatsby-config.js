const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";

module.exports = {
  siteMetadata: {
    title: "VimCS",
    siteUrl,
    description: "Great and simple app to navigate vim color schemes",
    author: "@reobin",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sass",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            policy: [
              process.env.GATSBY_DISABLE_ROBOTS
                ? { userAgent: "*", disallow: ["/"] }
                : { userAgent: "*", allow: ["/"] },
            ],
          },
        },
      },
    },
    {
      resolve: "gatsby-source-mongodb",
      options: {
        connectionString:
          process.env.GATSBY_DATABASE_CONNECTION_STRING ||
          "mongodb://localhost:27017",
        dbName: process.env.GATSBY_DATABASE_NAME || "vimcs",
        collection: ["repositories"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#000",
        theme_color: "#fff",
        display: "minimal-ui",
        icon: "src/images/logo.svg",
      },
    },
  ],
};
