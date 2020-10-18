const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:8000";

require("dotenv").config({
  path: ".env",
});

module.exports = {
  siteMetadata: {
    title: "vimcolorschemes",
    socialImageUrl: process.env.GATSBY_SOCIAL_IMAGE_URL || "",
    arrows: "hjkl",
    siteUrl,
    description: "Find the best vim color schemes around",
    metaDescription:
      "vimcolorschemes.com is the ultimate resource for vim users to find the perfect color scheme for their development environment. Come for the hundreds of vim color schemes, stay for the awesome hjkl spatial navigation.",
    author: "@reobin",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-root-import",
    "gatsby-plugin-sass",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    "gatsby-transformer-sharp",
    "gatsby-plugin-preact",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            policy: [
              process.env.GATSBY_ENABLE_ROBOTS
                ? { userAgent: "*", allow: ["/"] }
                : { userAgent: "*", disallow: ["/"] },
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
        name: "vimcolorschemes",
        short_name: "vimcolorschemes",
        start_url: "/",
        background_color: "#fff",
        theme_color: "#333",
        display: "standalone",
        icon: "src/images/logo_square.png",
      },
    },
  ],
};
