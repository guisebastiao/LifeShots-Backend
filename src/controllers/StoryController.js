import { extname, resolve, join } from "path";
import { literal, Op } from "sequelize";
import fs from "fs";

import { resizeImage } from "../utils/resizeImage";

import User from "../models/User";
import Story from "../models/Story";
import Follow from "../models/Follow";
import StoryImage from "../models/StoryImage";
import ProfilePicture from "../models/ProfilePicture";

class StoryController {
  async store(req, res) {
    try {
      const { content } = req.body;
      const { username, file } = req;

      const date = new Date();
      date.setHours(date.getHours() + 24);
      const expirate = date.toISOString();

      const { id } = await Story.create({
        userId: username,
        content,
        expirate,
      });

      const uploadDir = resolve(__dirname, "../../uploads/storyImages/");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const { originalname, buffer } = file;
      const random = Math.floor(Math.random() * 10000 + 10000);

      const filename = `${Date.now()}_${random}${extname(originalname)}`;
      const filepath = join(uploadDir, filename);

      await resizeImage({ buffer, filepath });

      await StoryImage.create({
        storyId: id,
        originalname,
        filename,
      });

      return res.json({
        success: ["Você publicou um story."],
      });
    } catch (error) {
      console.error("Error in StoryController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async show(req, res) {
    try {
      const { username } = req;

      const story = await Story.findAll({
        where: {
          userId: username,
        },
        order: [["createdAt", "DESC"]],
        attributes: ["id", "content", "amountLikes", "createdAt"],
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
            model: StoryImage,
            as: "storyImages",
            attributes: ["id", "filename", "url"],
          },
        ],
      });

      return res.json(story);
    } catch (error) {
      console.error("Error in StoryController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { username } = req;
      const { limit = 10, offset = 1 } = req.query;

      const followers = await Follow.findAll({
        where: { followingId: username },
        attributes: ["followerId"],
      });

      const followersIds = followers.map((follow) => follow.followerId);

      const whereClause = {
        username: {
          [Op.and]: [{ [Op.in]: followersIds }, { [Op.ne]: username }],
        },
      };

      const countStories = await User.count({
        where: whereClause,
      });

      const lastOffset = Math.ceil(countStories / Number(limit));

      const stories = await User.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: whereClause,
        include: [
          {
            model: Story,
            as: "stories",
            required: true,
            order: [["createdAt", "DESC"]],
            where: {
              [Op.and]: [
                literal(
                  `NOT EXISTS (SELECT 1 FROM block WHERE blockerId = :username AND blockedId = stories.userId)`
                ),
                literal(
                  `(SELECT privateAccount FROM user WHERE username = stories.userId) = false OR EXISTS (SELECT 1 FROM follow WHERE followingId = :username AND followerId = stories.userId AND EXISTS (SELECT 1 FROM follow WHERE followingId = stories.userId AND follow.followerId = :username))`
                ),
              ],
            },
            attributes: [
              "id",
              "content",
              "amountLikes",
              "createdAt",
              [
                literal(
                  `CASE WHEN EXISTS (SELECT 1 FROM likeStory WHERE userId = :username AND storyId = stories.id) THEN true ELSE false END`
                ),
                "isLiked",
              ],
            ],
            include: [
              {
                model: StoryImage,
                as: "storyImages",
                attributes: ["id", "filename", "url"],
              },
            ],
          },
          {
            model: ProfilePicture,
            as: "profilePicture",
            attributes: ["filename", "url"],
          },
        ],
        replacements: {
          username,
        },
        attributes: ["username", "privateAccount"],
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, stories });
    } catch (error) {
      console.error("Error in StoryController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { username } = req;
      const { storyId } = req.params;
      const { content } = req.body;

      const story = await Story.findByPk(storyId);

      if (story.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de editar esse story."],
        });
      }

      await story.update({ content });

      return res.json({
        success: ["Seu story foi editado."],
      });
    } catch (error) {
      console.error("Error in StoryController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { username } = req;

      const story = await Story.findByPk(id);

      if (story.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de excluir esse story."],
        });
      }

      const storyImage = await StoryImage.findOne({
        where: {
          storyId: id,
        },
      });

      const { filename } = storyImage;

      const filepath = resolve(
        __dirname,
        "../../uploads/storyImages/",
        filename
      );

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      await story.destroy();

      return res.json({
        success: ["Story delatado."],
      });
    } catch (error) {
      console.error("Error in StoryController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new StoryController();
