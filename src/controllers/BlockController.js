import ProfilePicture from "../models/ProfilePicture";
import Block from "../models/Block";
import User from "../models/User";

class BlockController {
  async store(req, res) {
    try {
      const { blocked } = req.body;
      const { username } = req;

      const block = await Block.findOne({
        where: {
          blockerId: username,
          blockedId: blocked,
        },
      });

      if (!block) {
        await Block.create({ blockedId: blocked, blockerId: username });

        return res.json({
          success: [`Você bloqueiou ${blocked}`],
        });
      } else {
        await block.destroy();

        return res.json({
          success: [`Você desbloqueiou ${blocked}`],
        });
      }
    } catch (error) {
      console.error("Error in BlockController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { username } = req;
      const { limit = 10, offset = 1 } = req.query;

      const countBlocks = await Block.count({
        where: {
          blockerId: username,
        },
      });

      const lastOffset = Math.ceil(countBlocks / Number(limit));

      const blocks = await Block.findAll({
        where: {
          blockerId: username,
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "blocked",
            attributes: [
              "username",
              "amountFollowing",
              "amountFollowers",
              "amountPosts",
            ],
            include: [
              {
                model: ProfilePicture,
                as: "profilePicture",
                attributes: ["url"],
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

      return res.json({ paging, blocks });
    } catch (error) {
      console.error("Error in BlockController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new BlockController();
