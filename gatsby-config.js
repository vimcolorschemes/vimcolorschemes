module.exports = {
  siteMetadata: {
    title: "VimCS",
    siteUrl: process.env.GATSBY_SITE_URL || "http://localhost:8000",
    description: "Great and simple app to navigate vim color schemes",
    author: "@reobin",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: process.env.GATSBY_SITE_URL || "http://localhost:8000",
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            // will allow everything when ready
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
        },
      },
    },
    {
      resolve: "gatsby-source-mongodb",
      options: {
        connectionString: "mongodb://localhost:27017",
        dbName: "vimcs",
        collection: ["repositories", "imports"],
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
        icon: "src/images/gatsby-icon.png",
      },
    },
  ],
};
