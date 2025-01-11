require("dotenv").config();

module.exports = {
  dialect: process.env.DIALECT,
  host: process.env.HOST,
  username: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
  dialectOptions: {
    timezone: "+00:00",
  },
  timezone: "+00:00",
};
