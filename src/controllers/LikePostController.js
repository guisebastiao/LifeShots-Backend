import Post from "../models/Post";
import LikePost from "../models/LikePost";
import Notification from "../models/Notification";
import ProfilePicture from "../models/ProfilePicture";
import Setting from "../models/Setting";
import User from "../models/User";

class LikePostController {
  async store(req, res) {
    try {
      const { postId } = req.body;
      const { username } = req;

      const likePost = await LikePost.findOne({
        where: {
          userId: username,
          postId,
        },
      });

      const post = await Post.findByPk(postId);

      if (likePost) {
        await likePost.destroy();

        await post.update({ amountLikes: post.amountLikes - 1 });

        return res.json({
          success: ["Você desmarcou como curtida uma publicação."],
        });
      } else {
        await LikePost.create({ userId: username, postId });

        await post.update({ amountLikes: post.amountLikes + 1 });

        const { notifyLikePost } = await Setting.findByPk(username);

        if (notifyLikePost && username !== post.userId) {
          await Notification.create({
            recipientId: post.userId,
            senderId: username,
            message: `${username} curtiu sua publicação.`,
            type: "like-post",
          });
        }

        return res.json({
          success: ["Você marcou como curtida uma publicação."],
        });
      }
    } catch (error) {
      console.error("Error in LikePostController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { postId } = req.params;
      const { limit = 10, offset = 1 } = req.query;

      const countLikes = await LikePost.count({
        where: {
          postId,
        },
      });

      const lastOffset = Math.ceil(countLikes / Number(limit));

      const likesPost = await LikePost.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          postId,
        },
        order: [["createdAt", "DESC"]],
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "userLikedPost",
            attributes: [
              "username",
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
          },
        ],
      });

      const paging = {
        offset: Number(offset),
        prev: Number(offset) > 1 ? Number(offset) - 1 : null,
        next: Number(offset) >= lastOffset ? null : Number(offset) + 1,
        lastOffset,
      };

      return res.json({ paging, likesPost });
    } catch (error) {
      console.error("Error in LikePostController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new LikePostController();
