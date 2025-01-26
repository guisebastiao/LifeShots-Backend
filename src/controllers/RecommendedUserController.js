import { Op } from "sequelize";

import User from "../models/User";
import Follow from "../models/Follow";
import ProfilePicture from "../models/ProfilePicture";

class RecomendedUserController {
  async index(req, res) {
    try {
      const { username } = req;
      const { offset = 1, limit = 10 } = req.query;

      const followingList = await Follow.findAll({
        where: {
          followingId: username,
        },
        attributes: ["followerId"],
      });

      const followingUsernames = followingList.map(
        (follow) => follow.followerId
      );

      const countFollowing = await Follow.count({
        where: {
          followingId: {
            [Op.in]: followingUsernames,
          },
          followerId: {
            [Op.notIn]: followingUsernames,
            [Op.not]: username,
          },
        },
      });

      const lastOffset = Math.ceil(countFollowing / Number(limit));

      const recommendedUsers = await Follow.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          followingId: {
            [Op.in]: followingUsernames,
          },
          followerId: {
            [Op.notIn]: followingUsernames,
            [Op.not]: username,
          },
        },
        attributes: ["followerId"],
        group: "followerId",
      });

      const recommendedUsernames = recommendedUsers.map(
        (user) => user.followerId
      );

      const users = await User.findAll({
        where: {
          username: {
            [Op.in]: recommendedUsernames,
          },
        },
        attributes: [
          "username",
          "amountFollowing",
          "amountFollowers",
          "amountPosts",
          "privateAccount",
        ],
        include: [
          {
            model: ProfilePicture,
            as: "profilePicture",
            attributes: ["filename", "url"],
          },
        ],
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, users });
    } catch (error) {
      console.error("Error in RecommendUserController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new RecomendedUserController();
