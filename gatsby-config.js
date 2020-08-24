const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";

module.exports = {
  siteMetadata: {
    title: process.env.GATSBY_SITE_TITLE || "colorschemes",
    platform: process.env.GATSBY_SITE_PLATFORM || "vim",
    socialImageUrl: process.env.GATSBY_SOCIAL_IMAGE_URL || "",
    arrows: "hjkl",
    siteUrl,
    description:
      process.env.GATSBY_SITE_DESCRIPTION ||
      "Find the best vim color schemes around",
    author: "@reobin",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-root-import",
    "gatsby-plugin-sass",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-sharp",
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
        name: `${process.env.GATSBY_SITE_PLATFORM || "vim"}${
          process.env.GATSBY_SITE_TITLE || "colorschemes"
        }`,
        short_name: `${process.env.GATSBY_SITE_PLATFORM || "vim"}${
          process.env.GATSBY_SITE_TITLE || "colorschemes"
        }`,
        start_url: "/",
        background_color: "#fff",
        theme_color: "#333",
        display: "standalone",
        icon: "src/images/logo_square.png",
      },
    },
  ],
};
