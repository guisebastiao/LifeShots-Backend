import CommentPost from "../models/CommentPost";
import LikeComment from "../models/LikeComment";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

class LikeCommentController {
  async store(req, res) {
    try {
      const { commentId } = req.body;
      const { username } = req;

      const likeComment = await LikeComment.findOne({
        where: {
          userId: username,
          commentId,
        },
      });

      const comment = await CommentPost.findByPk(commentId);

      if (likeComment) {
        await likeComment.destroy();

        await comment.update({ amountLikes: comment.amountLikes - 1 });

        return res.json({
          success: ["Você desmarcou como curtida um comentário."],
        });
      } else {
        await LikeComment.create({ userId: username, commentId });

        await comment.update({ amountLikes: comment.amountLikes + 1 });

        const { notifyLikeComment } = await Setting.findByPk(username);

        if (notifyLikeComment && username !== comment.userId) {
          await Notification.create({
            recipientId: comment.userId,
            senderId: username,
            message: `${username} curtiu seu comentário.`,
            type: "like-comment",
          });
        }

        return res.json({
          success: ["Você marcou como curtida um comentário."],
        });
      }
    } catch (error) {
      console.error("Error in LikeCommentController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new LikeCommentController();
