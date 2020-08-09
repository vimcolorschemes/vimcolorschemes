const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";

module.exports = {
  siteMetadata: {
    title: process.env.GATSBY_SITE_TITLE || "colorschemes",
    platform: process.env.GATSBY_SITE_PLATFORM || "vim",
    socialImageUrl: process.env.GATSBY_SOCIAL_IMAGE_URL || "",
    arrows: "hjkl",
    siteUrl,
    description: process.env.GATSBY_SITE_DESCRIPTION || "Find the best vim color schemes around",
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
        dbName: process.env.GATSBY_DATABASE_NAME || "colorschemes",
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
