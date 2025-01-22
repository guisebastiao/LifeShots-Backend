import Follow from "../models/Follow";
import User from "../models/User";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

class FollowController {
  async store(req, res) {
    try {
      const { userId } = req.body;
      const { username } = req;

      if (username.toLowerCase() === userId.toLowerCase().trim()) {
        res.status(400).json({
          errors: ["Você não pode seguir você mesmo."],
        });
      }

      const follow = await Follow.findOne({
        where: {
          followingId: username,
          followerId: userId,
        },
      });

      const following = await User.findByPk(username);
      const follower = await User.findByPk(userId);

      if (follow) {
        await follow.destroy();

        await following.update({
          amountFollowing: following.amountFollowing - 1,
        });

        await follower.update({
          amountFollowers: follower.amountFollowers - 1,
        });

        return res.json({
          success: [`Você parou de seguir ${userId}`],
        });
      } else {
        await Follow.create({ followingId: username, followerId: userId });

        await following.update({
          amountFollowing: following.amountFollowing + 1,
        });

        await follower.update({
          amountFollowers: follower.amountFollowers + 1,
        });

        const { notifyNewFollows } = await Setting.findByPk(username);

        if (notifyNewFollows) {
          await Notification.create({
            recipientId: userId,
            senderId: username,
            message: `${username} começou a seguir você.`,
            type: "new-follow",
          });
        }

        return res.json({
          success: [`Você está seguindo ${userId}`],
        });
      }
    } catch (error) {
      console.error("Error in FollowController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { type } = req.query;
      const { userId } = req.params;
      const { offset = 1, limit = 10 } = req.query;

      if (type === "following") {
        const countFollowing = await Follow.count({
          where: {
            followingId: userId,
          },
        });

        const lastOffset = Math.ceil(countFollowing / Number(limit));

        const following = await Follow.findAll({
          offset: Number(offset * limit - limit),
          limit: Number(limit),
          where: {
            followingId: userId,
          },
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "followers",
              attributes: [
                "username",
                "profilePicture",
                "amountFollowing",
                "amountFollowers",
                "amountPosts",
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

        return res.json({
          paging,
          following: following.map(({ followers }) => followers),
        });
      }

      if (type === "followers") {
        const countFollowing = await Follow.count({
          where: {
            followerId: userId,
          },
        });

        const lastOffset = Math.ceil(countFollowing / Number(limit));

        const followers = await Follow.findAll({
          where: {
            followerId: userId,
          },
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "following",
              attributes: [
                "username",
                "profilePicture",
                "amountFollowing",
                "amountFollowers",
                "amountPosts",
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

        return res.json({
          paging,
          followers: followers.map(({ following }) => following),
        });
      }

      return res.json([]);
    } catch (error) {
      console.error("Error in FollowController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new FollowController();
