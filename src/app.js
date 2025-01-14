import "./database";

import { resolve } from "path";
import express from "express";
import cron from "node-cron";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import hpp from "hpp";

import { expirateUserBlocked } from "./cron/expirateUserBlocked";
import { expirateUserLogin } from "./cron/expirateUserLogin";
import { expirateUserPending } from "./cron/expirateUserPending";
import { expirateStory } from "./cron/expirateStory";

import registerRoutes from "./routes/registerRoutes";
import activeAccountRoutes from "./routes/activeAccountRoutes";
import loginRoutes from "./routes/loginRoutes";
import activeLoginRoutes from "./routes/activeLoginRoutes";
import blockRoutes from "./routes/blockRoutes";
import followRoutes from "./routes/followRoutes";
import profilePictureRoutes from "./routes/profilePictureRoutes";
import userRoutes from "./routes/userRoutes";
import resetPasswordRoutes from "./routes/resetPasswordRoutes";
import postRoutes from "./routes/postRoutes";
import likePostRoutes from "./routes/likePostRoutes";
import commentPostRoutes from "./routes/commentPostRoutes";
import postImageRoutes from "./routes/postImageRoutes";
import likeCommentRoutes from "./routes/likeCommentRoutes";
import commentTreeRoutes from "./routes/commentTreeRoutes";
import likeCommentTreeRoutes from "./routes/likeCommentTreeRoutes";
import storyRoutes from "./routes/storyRoutes";
import likeStoryRoutes from "./routes/likeStoryRoutes";
import feedRoutes from "./routes/feedRoutes";
import explorerRoutes from "./routes/explorerRoutes";
import searchRoutes from "./routes/searchRoutes";
import recommendedUsersRoutes from "./routes/recommendedUsersRoutes";
import settingRoutes from "./routes/settingRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const whitelist = ["http://localhost:5173"];

const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
    cron.schedule("* * * * *", () => {
      expirateUserBlocked();
      expirateUserLogin();
      expirateUserPending();
      expirateStory();
    });
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(xss());
    this.app.use(hpp());

    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            "img-src": ["'self'", ...whitelist],
          },
        },
        crossOriginResourcePolicy: {
          policy: "cross-origin",
        },
      })
    );

    this.app.use("/post-images/", express.static(resolve(__dirname, "..", "uploads", "postImages")));
    this.app.use("/profile-picture/", express.static(resolve(__dirname, "..", "uploads", "profilePictures")));
    this.app.use("/story-images/", express.static(resolve(__dirname, "..", "uploads", "storyImages")));
  }

  routes() {
    this.app.use("/api/register/", registerRoutes);
    this.app.use("/api/login/", loginRoutes);
    this.app.use("/api/active-account/", activeAccountRoutes);
    this.app.use("/api/active-login/", activeLoginRoutes);
    this.app.use("/api/blocks/", blockRoutes);
    this.app.use("/api/follows/", followRoutes);
    this.app.use("/api/profile-picture/", profilePictureRoutes);
    this.app.use("/api/users/", userRoutes);
    this.app.use("/api/reset-password/", resetPasswordRoutes);
    this.app.use("/api/posts/", postRoutes);
    this.app.use("/api/likes-posts/", likePostRoutes);
    this.app.use("/api/comments/", commentPostRoutes);
    this.app.use("/api/posts-images/", postImageRoutes);
    this.app.use("/api/likes-comments/", likeCommentRoutes);
    this.app.use("/api/comments-tree/", commentTreeRoutes);
    this.app.use("/api/likes-comments-tree/", likeCommentTreeRoutes);
    this.app.use("/api/stories/", storyRoutes);
    this.app.use("/api/likes-stories/", likeStoryRoutes);
    this.app.use("/api/feed/", feedRoutes);
    this.app.use("/api/explorer/", explorerRoutes);
    this.app.use("/api/search/", searchRoutes);
    this.app.use("/api/recommended-users/", recommendedUsersRoutes);
    this.app.use("/api/settings/", settingRoutes);
    this.app.use("/api/notifications/", notificationRoutes);
  }
}

export default new App().app;
