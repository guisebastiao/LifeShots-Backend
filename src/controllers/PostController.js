import { extname, resolve, join } from "path";
import { literal, Op } from "sequelize";
import fs from "fs";

import Post from "../models/Post";
import LikePost from "../models/LikePost";
import PostImage from "../models/PostImage";
import ProfilePicture from "../models/ProfilePicture";
import Follow from "../models/Follow";
import User from "../models/User";

import { resizeImage } from "../utils/resizeImage";

class PostController {
  async store(req, res) {
    try {
      const { content } = req.body;
      const { username, files } = req;

      const { id } = await Post.create({ content, userId: username });

      const uploadDir = resolve(__dirname, "../../uploads/postImages/");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      files.map(async (file) => {
        const { originalname, buffer } = file;
        const random = Math.floor(Math.random() * 10000 + 10000);

        const filename = `${Date.now()}_${random}${extname(originalname)}`;
        const filepath = join(uploadDir, filename);

        await resizeImage({ buffer, filepath });
        await PostImage.create({ originalname, filename, postId: id });
      });

      const user = await User.findByPk(username);

      await user.update({ amountPosts: user.amountPosts + 1 });

      return res.json({
        success: ["Você fez uma publicação."],
      });
    } catch (error) {
      console.error("Error in PostController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async show(req, res) {
    try {
      const { postId } = req.params;
      const { username } = req;

      const post = await Post.findByPk(postId, {
        attributes: [
          "id",
          "content",
          "amountLikes",
          "amountComments",
          "createdAt",
          [
            literal(
              `CASE WHEN post.userId = :username THEN true ELSE false END`
            ),
            "isMyPost",
          ],
          [
            literal(
              `CASE WHEN EXISTS (SELECT 1 FROM likePost WHERE userId = :username AND postId = post.id) THEN true ELSE false END`
            ),
            "isLiked",
          ],
        ],
        replacements: {
          username,
        },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "privateAccount"],
            include: [
              {
                model: ProfilePicture,
                as: "profilePicture",
                attributes: ["filename", "url"],
              },
            ],
          },
          {
            model: PostImage,
            as: "postImages",
            attributes: ["id", "filename", "url"],
          },
        ],
      });

      return res.json(post);
    } catch (error) {
      console.error("Error in PostController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10, offset = 1 } = req.query;
      const { username } = req;

      const follow = await Follow.findOne({
        where: {
          followingId: username,
          followerId: userId,
        },
      });

      const { privateAccount } = await User.findByPk(userId);

      if (privateAccount && !follow) {
        return res.status(401).json({
          errors: [
            "Você não tem permissão de visualizar as publicações desse usuário.",
          ],
        });
      }

      const whereClause = {
        userId,
        [Op.and]: [
          literal(
            `NOT EXISTS (SELECT 1 FROM block WHERE (blockerId = :username AND blockedId = post.userId) OR (blockedId = :username AND blockerId = post.userId))`,
            true
          ),
        ],
      };

      const countPosts = await Post.count({
        where: whereClause,
        replacements: {
          username,
        },
      });

      const lastOffset = Math.ceil(countPosts / Number(limit));

      const posts = await Post.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: whereClause,
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "content",
          "amountLikes",
          "amountComments",
          "createdAt",
          [
            literal(
              `CASE WHEN post.userId = :username THEN true ELSE false END`
            ),
            "isMyPost",
          ],
          [
            literal(
              `CASE WHEN EXISTS (SELECT 1 FROM likePost WHERE userId = :username AND postId = post.id) THEN true ELSE false END`
            ),
            "isLiked",
          ],
        ],
        replacements: {
          username,
        },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "privateAccount"],
            include: [
              {
                model: ProfilePicture,
                as: "profilePicture",
                attributes: ["filename", "url"],
              },
            ],
          },
          {
            model: PostImage,
            as: "postImages",
            attributes: ["id", "filename", "url"],
          },
          {
            model: LikePost,
            as: "likes",
            order: [["createdAt", "DESC"]],
            attributes: ["userId"],
            limit: 1,
            include: [
              {
                model: User,
                as: "userLikedPost",
                attributes: ["username", "privateAccount"],
                include: [
                  {
                    model: ProfilePicture,
                    as: "profilePicture",
                    attributes: ["filename", "url"],
                  },
                ],
              },
            ],
          },
        ],
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, posts });
    } catch (error) {
      console.error("Error in PostController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { username, files } = req;
      const { postId } = req.params;
      const { content } = req.body;

      const post = await Post.findByPk(postId);

      if (post.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de editar essa publicação."],
        });
      }

      const uploadDir = resolve(__dirname, "../../uploads/postImages/");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      files.map(async (file) => {
        const { originalname, buffer } = file;
        const random = Math.floor(Math.random() * 10000 + 10000);

        const filename = `${Date.now()}_${random}${extname(originalname)}`;
        const filepath = join(uploadDir, filename);

        await resizeImage({ buffer, filepath });
        await PostImage.create({ originalname, filename, postId });
      });

      await post.update({ content });

      return res.json({
        success: ["Sua publicação foi editada."],
      });
    } catch (error) {
      console.error("Error in PostController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.body;
      const { username } = req;

      const post = await Post.findByPk(id);

      if (!post) {
        return res.status(400).json({
          errors: ["Essa publicação já foi excluida."],
        });
      }

      if (post.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de excluir essa publicação."],
        });
      }

      const postImages = await PostImage.findAll({
        where: {
          postId: id,
        },
      });

      postImages.map(async (images) => {
        const { filename } = images;

        const filepath = resolve(
          __dirname,
          "../../uploads/postImages/",
          filename
        );

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        await images.destroy();
      });

      await post.destroy();

      const user = await User.findByPk(username);

      await user.update({ amountPosts: user.amountPosts - 1 });

      return res.json({
        success: ["Publicação delatada."],
      });
    } catch (error) {
      console.error("Error in PostController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new PostController();
