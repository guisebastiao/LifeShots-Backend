require("dotenv").config();

export default {
  url_server: `http://192.168.18.78:${process.env.SERVER_PORT}`,
  url_site: `http://192.168.18.78:${process.env.SITE_PORT}`,
};
