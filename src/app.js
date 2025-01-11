import "./database";

import { resolve } from "path";
import express from "express";
import cron from "node-cron";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import hpp from "hpp";

const whitelist = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.cron();
  }

  cron() {
    cron.schedule("* * * * *", () => {});
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(express.json());
    this.app.use(xss());
    this.app.use(hpp());
    this.app.use("/post-images/", express.static(resolve(__dirname, "..", "uploads", "postImages")));
    this.app.use("/profile-picture/", express.static(resolve(__dirname, "..", "uploads", "profilePictures")));
    this.app.use("/story-images/", express.static(resolve(__dirname, "..", "uploads", "storyImages")));
  }

  routes() {}
}

export default new App().app;
