require("dotenv").config();

export default {
  url_server: `http://localhost:${process.env.SERVER_PORT}`,
  url_site: `http://localhost:${process.env.SITE_PORT}`,
};
