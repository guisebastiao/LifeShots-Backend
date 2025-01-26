import { Op } from "sequelize";

import User from "../models/User";
import ProfilePicture from "../models/ProfilePicture";

class SearchController {
  async index(req, res) {
    try {
      const { limit = 10, offset = 1, user = null } = req.query;

      if (String(user).length < 3) {
        return res.status(401).json({
          errors: ["A pesquisa deve ter mais de 3 caracteres."],
        });
      }

      const whereClause = {
        [Op.or]: [
          {
            username: {
              [Op.like]: user,
            },
          },
          {
            name: {
              [Op.like]: user,
            },
          },
          {
            surname: {
              [Op.like]: user,
            },
          },
        ],
      };

      const countUsers = await User.count({
        where: whereClause,
      });

      const lastOffset = Math.ceil(countUsers / Number(limit));

      const users = await User.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: whereClause,
        attributes: [
          "username",
          "name",
          "surname",
          "bio",
          "privateAccount",
          "amountFollowing",
          "amountFollowers",
          "amountPosts",
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
      console.error("Error in SearchController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new SearchController();
