import { resolve } from "path";
import fs from "fs";

import PostImage from "../models/PostImage";
import Post from "../models/Post";

class PostImageController {
  async delete(req, res) {
    try {
      const { id } = req.body;
      const { username } = req;

      const postImage = await PostImage.findByPk(id);

      if (!postImage) {
        return res.status(400).json({
          errors: ["Essa imagem já foi excluida."],
        });
      }

      const post = await Post.findByPk(postImage.postId);

      if (post.userId !== username) {
        return res.status(401).json({
          errors: ["Você não tem permissão de excluir a imagem dessa publicação."],
        });
      }

      const { filename } = postImage;

      const filepath = resolve(__dirname, "../../uploads/postImages/", filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      await postImage.destroy();

      const countPostImages = await PostImage.count({
        where: {
          postId: postImage.postId,
        },
      });

      if (countPostImages <= 0) {
        await post.destroy();

        return res.json({
          success: ["A imagem da publicação e a publicação foram excluidas."],
        });
      }

      return res.json({
        success: ["A imagem da publicação foi excluida."],
      });
    } catch (error) {
      console.error("Error in PostImageController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new PostImageController();
