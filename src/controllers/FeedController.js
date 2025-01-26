import { Op, literal } from "sequelize";

import Post from "../models/Post";
import PostImage from "../models/PostImage";
import User from "../models/User";
import Follow from "../models/Follow";
import LikePost from "../models/LikePost";
import ProfilePicture from "../models/ProfilePicture";

class FeedController {
  async index(req, res) {
    try {
      const { limit = 10, offset = 1 } = req.query;
      const { username } = req;

      const follows = await Follow.findAll({
        where: {
          followingId: username,
        },
        attributes: ["followerId"],
      });

      const followersIds = follows.map((follow) => follow.followerId);

      const whereClause = {
        userId: {
          [Op.in]: followersIds,
        },
        [Op.and]: [
          literal(
            `NOT EXISTS (SELECT 1 FROM block WHERE (blockerId = :username AND blockedId = post.userId) OR (blockerId = post.userId AND blockedId = :username))`,
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
      console.error("Error in FeedController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new FeedController();
