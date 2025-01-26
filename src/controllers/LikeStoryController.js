import LikeStory from "../models/LikeStory";
import Notification from "../models/Notification";
import ProfilePicture from "../models/ProfilePicture";
import Setting from "../models/Setting";
import Story from "../models/Story";
import User from "../models/User";

class LikeStoryController {
  async store(req, res) {
    try {
      const { id } = req.body;
      const { username } = req;

      const story = await Story.findByPk(id);

      if (story.userId === username) {
        return res.status(401).json({
          errors: ["Você não pode curtir seu próprio story"],
        });
      }

      const likeStory = await LikeStory.findOne({
        where: {
          userId: username,
          storyId: id,
        },
      });

      if (likeStory) {
        await likeStory.destroy();

        await story.update({ amountLikes: story.amountLikes - 1 });

        return res.json({
          success: ["Você desmarcou como curtida um story."],
        });
      } else {
        await LikeStory.create({ userId: username, storyId: id });

        await story.update({ amountLikes: story.amountLikes + 1 });

        const { notifyStory } = await Setting.findByPk(username);

        if (notifyStory) {
          await Notification.create({
            recipientId: story.userId,
            senderId: username,
            message: `${username} curtiu seu story.`,
            type: "like-story",
          });
        }

        return res.json({
          success: ["Você marcou como curtida um story."],
        });
      }
    } catch (error) {
      console.error("Error in LikeStoryController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { storyId } = req.params;
      const { limit = 10, offset = 1 } = req.query;

      const countLikes = await LikeStory.count({
        offset: Number(offset * limit - limit),
        where: { storyId },
      });

      const lastOffset = Math.ceil(countLikes / Number(limit));

      const likesStory = await LikeStory.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: { storyId },
        order: [["createdAt", "DESC"]],
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "userLikedStory",
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
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, likesStory });
    } catch (error) {
      console.error("Error in LikePostController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new LikeStoryController();
