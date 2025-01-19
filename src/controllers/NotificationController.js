import Notification from "../models/Notification";
import User from "../models/User";

class NotificationController {
  async index(req, res) {
    try {
      const { username } = req;
      const { offset = 1, limit = 10 } = req.query;

      const countNotifications = await Notification.count({
        where: {
          recipientId: username,
        },
      });

      const lastOffset = Math.ceil(countNotifications / Number(limit));

      const notifications = await Notification.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          recipientId: username,
        },
        attributes: [
          "id",
          "recipientId",
          "senderId",
          "message",
          "type",
          "isRead",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["username", "profilePicture", "privateAccount"],
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
        notifications,
      });
    } catch (error) {
      console.error("Error in NotificationController - Index", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async show(req, res) {
    try {
      const { username } = req;

      const hasUnread = await Notification.findAll({
        where: {
          recipientId: username,
          isRead: false,
        },
      });

      const isRead = hasUnread.length === 0;

      return res.json({ isRead });
    } catch (error) {
      console.error("Error in NotificationController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { username } = req;

      const [updateCount] = await Notification.update(
        {
          isRead: true,
        },
        {
          where: {
            recipientId: username,
            isRead: false,
          },
        }
      );

      return res.json({
        success: [`${updateCount} notificações marcadas como lidas.`],
      });
    } catch (error) {
      console.error("Error in NotificationController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { username } = req;

      const deletedCount = await Notification.destroy({
        where: {
          recipientId: username,
        },
      });

      return res.json({
        success: [`${deletedCount} notificações foram excluidas.`],
      });
    } catch (error) {
      console.error("Error in NotificationController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new NotificationController();
