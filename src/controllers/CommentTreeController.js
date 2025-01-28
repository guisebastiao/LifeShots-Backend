import { literal } from "sequelize";

import User from "../models/User";
import Post from "../models/Post";
import ProfilePicture from "../models/ProfilePicture";
import CommentTree from "../models/CommentTree";
import CommentPost from "../models/CommentPost";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

class CommentTreeController {
  async store(req, res) {
    try {
      const { username } = req;
      const { commentId, content } = req.body;

      const { postId } = await CommentPost.findByPk(commentId);

      await CommentTree.create({
        userId: username,
        postId,
        commentId,
        content,
      });

      const comment = await CommentPost.findByPk(commentId);

      await comment.update({
        amountCommentTree: comment.dataValues.amountCommentTree + 1,
      });

      const { notifyCommentTree } = await Setting.findByPk(username);

      if (notifyCommentTree && username !== comment.userId) {
        await Notification.create({
          recipientId: comment.userId,
          senderId: username,
          message: `${username} respondeu ao seu comentário.`,
          type: "comment-tree",
        });
      }

      return res.json({
        success: ["Você comentou em um comentário."],
      });
    } catch (error) {
      console.error("Error in CommentTreeController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { commentId } = req.params;
      const { limit = 10, offset = 1 } = req.query;
      const { username } = req;

      const countCommentTree = await CommentTree.count({
        where: {
          commentId,
        },
      });

      const lastOffset = Math.ceil(countCommentTree / Number(limit));

      const commentsTree = await CommentTree.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          commentId,
        },
        order: [["amountLikes", "DESC"]],
        attributes: [
          "id",
          "content",
          "amountLikes",
          "createdAt",
          [
            literal(
              `CASE WHEN commentTree.userId = :username THEN true ELSE false END`
            ),
            "isMyCommentTree",
          ],
          [
            literal(
              `CASE WHEN EXISTS (SELECT 1 FROM likeCommentTree WHERE userId = :username AND commentTreeId = commentTree.id) THEN true ELSE false END`
            ),
            "isLiked",
          ],
        ],
        replacements: {
          username,
        },
        include: [
          {
            model: User,
            as: "userCommentsTree",
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

      return res.json({ paging, commentsTree });
    } catch (error) {
      console.error("Error in CommentTreeController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { content } = req.body;
      const { commentTreeId } = req.params;
      const { username } = req;

      const commentTree = await CommentTree.findByPk(commentTreeId);

      if (commentTree.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de editar esse comentário."],
        });
      }

      await commentTree.update({ content });

      return res.json({
        success: ["Seu comentário foi editado."],
      });
    } catch (error) {
      console.error("Error in CommentTreeController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { username } = req;

      const commentTree = await CommentTree.findByPk(id);
      const post = await Post.findByPk(commentTree.postId);
      const comment = await CommentPost.findByPk(commentTree.commentId);

      if (post.userId !== username && commentTree.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de excluir esse comentário."],
        });
      }

      await comment.update({
        amountCommentTree: comment.amountCommentTree - 1,
      });

      await commentTree.destroy();

      return res.json({
        success: ["Comentário foi excluido."],
      });
    } catch (error) {
      console.error("Error in CommentTreeController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new CommentTreeController();
