import CommentTree from "../models/CommentTree";
import LikeCommentTree from "../models/LikeCommentTree";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

class LikeCommentTreeController {
  async store(req, res) {
    try {
      const { commentTreeId } = req.body;
      const { username } = req;

      const likeCommentTree = await LikeCommentTree.findOne({
        where: {
          userId: username,
          commentTreeId: commentTreeId,
        },
      });

      const commentTree = await CommentTree.findByPk(commentTreeId);

      if (likeCommentTree) {
        await likeCommentTree.destroy();

        await commentTree.update({ amountLikes: commentTree.amountLikes - 1 });

        return res.json({
          success: ["Você desmarcou como curtida um comentário."],
        });
      } else {
        await LikeCommentTree.create({ userId: username, commentTreeId: commentTreeId });

        await commentTree.update({ amountLikes: commentTree.amountLikes + 1 });

        const { notifyLikeCommentTree } = await Setting.findByPk(username);

        if (notifyLikeCommentTree) {
          await Notification.create({
            recipientId: commentTree.userId,
            senderId: username,
            type: "like-comment-tree",
          });
        }

        return res.json({
          success: ["Você marcou como curtida um comentário."],
        });
      }
    } catch (error) {
      console.error("Error in LikeCommentTreeController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new LikeCommentTreeController();
