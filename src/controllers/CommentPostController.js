import { literal } from "sequelize";

import Post from "../models/Post";
import User from "../models/User";
import CommentPost from "../models/CommentPost";
import Notification from "../models/Notification";
import Setting from "../models/Setting";

class CommentPostController {
  async store(req, res) {
    try {
      const { username } = req;
      const { postId, content } = req.body;

      await CommentPost.create({ userId: username, postId, content });

      const post = await Post.findByPk(postId);
      await post.update({ amountComments: post.amountComments + 1 });

      const { notifyCommentPost } = await Setting.findByPk(username);

      if (notifyCommentPost && username !== post.userId) {
        await Notification.create({
          recipientId: post.userId,
          senderId: username,
          type: "comment-post",
        });
      }

      return res.json({
        success: ["Você comentou em uma publicação."],
      });
    } catch (error) {
      console.error("Error in CommentPostController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async index(req, res) {
    try {
      const { postId } = req.params;
      const { limit = 10, offset = 1 } = req.query;
      const { username } = req;

      const countCommentPosts = await CommentPost.count({
        where: {
          postId,
        },
      });

      const lastOffset = Math.ceil(countCommentPosts / Number(limit));

      const commentsPosts = await CommentPost.findAll({
        offset: Number(offset * limit - limit),
        limit: Number(limit),
        where: {
          postId,
        },
        order: [["amountLikes", "DESC"]],
        attributes: [
          "id",
          "content",
          "amountLikes",
          "amountCommentTree",
          "createdAt",
          [literal(`CASE WHEN commentPost.userId = :username THEN true ELSE false END`), "isMyComment"],
          [literal(`CASE WHEN EXISTS (SELECT 1 FROM likeComment WHERE userId = :username AND commentId = commentPost.id) THEN true ELSE false END`), "isLiked"],
        ],
        replacements: {
          username,
        },
        include: [
          {
            model: User,
            as: "userComments",
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

      return res.json({ paging, commentsPosts });
    } catch (error) {
      console.error("Error in CommentPostController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { content } = req.body;
      const { commentId } = req.params;
      const { username } = req;

      const comment = await CommentPost.findByPk(commentId);

      if (comment.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de editar esse comentário."],
        });
      }

      await comment.update({ content });

      return res.json({
        success: ["Seu comentário foi editado."],
      });
    } catch (error) {
      console.error("Error in CommentPostController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.body;
      const { username } = req;

      const comment = await CommentPost.findByPk(id);
      const post = await Post.findByPk(comment.postId);

      if (post.userId !== username || comment.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de excluir esse comentário."],
        });
      }

      await comment.destroy();

      return res.json({
        success: ["Comentário excluido."],
      });
    } catch (error) {
      console.error("Error in CommentPostController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new CommentPostController();
