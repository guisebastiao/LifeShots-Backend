import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";

import TemporaryBlocked from "../models/TemporaryBlocked";
import User from "../models/User";
import UserPending from "../models/UserPending";
import UserLogin from "../models/UserLogin";
import Block from "../models/Block";
import Follow from "../models/Follow";
import ProfilePicture from "../models/ProfilePicture";
import ResetPassword from "../models/ResetPassword";
import Post from "../models/Post";
import PostImage from "../models/PostImage";
import LikePost from "../models/LikePost";
import CommentPost from "../models/CommentPost";
import LikeComment from "../models/LikeComment";
import CommentTree from "../models/CommentTree";
import LikeCommentTree from "../models/LikeCommentTree";
import Story from "../models/Story";
import StoryImage from "../models/StoryImage";
import LikeStory from "../models/LikeStory";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

const models = [
  TemporaryBlocked,
  User,
  UserPending,
  UserLogin,
  Block,
  Follow,
  ProfilePicture,
  ResetPassword,
  Post,
  PostImage,
  LikePost,
  CommentPost,
  LikeComment,
  CommentTree,
  LikeCommentTree,
  Story,
  StoryImage,
  LikeStory,
  Notification,
  Setting,
];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
