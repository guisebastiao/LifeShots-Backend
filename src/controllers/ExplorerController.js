import { Op, literal } from "sequelize";

import Post from "../models/Post";
import User from "../models/User";
import LikePost from "../models/LikePost";
import PostImage from "../models/PostImage";

class ExplorerController {
  async index(req, res) {
    try {
      const { limit = 10, offset = 1 } = req.query;
      const { username } = req;

      const date = new Date();
      date.setHours(date.getHours() - 24);
      const dateUTC = date.toISOString();

      const whereClause = {
        createdAt: {
          [Op.gte]: dateUTC,
        },
        [Op.and]: [
          literal(
            `NOT EXISTS (SELECT 1 FROM block WHERE blockerId = ':username' AND blockedId = Post.userId)`
          ),
          true,
        ],
      };

      const countPosts = await Post.count({
        where: whereClause,
      });

      const lastOffset = Math.ceil(countPosts / Number(limit));

      const posts = await Post.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: whereClause,
        order: [["amountLikes", "DESC"]],
        attributes: [
          "id",
          "content",
          "amountLikes",
          "amountComments",
          "createdAt",
          [
            literal(
              `CASE WHEN Post.userId = :username THEN true ELSE false END`
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
            attributes: [
              "username",
              "profilePicture",
              "privateAccount",
              [
                literal(
                  `(SELECT CASE WHEN EXISTS (SELECT 1 FROM block WHERE (blockerId = :username AND blockedId = post.userId) OR (blockerId = post.userId AND blockedId = :username)) THEN true ELSE false END)`
                ),
                "isBlockedUser",
              ],
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
                attributes: ["username", "profilePicture", "privateAccount"],
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
      console.error("Error in ExplorerController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new ExplorerController();
