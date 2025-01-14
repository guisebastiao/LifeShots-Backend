import Setting from "../models/Setting";

class SettingController {
  async update(req, res) {
    try {
      const { username } = req;
      const { notifyLikePost, notifyLikeComment, notifyLikeCommentTree, notifyCommentPost, notifyCommentTree, notifyNewFollows, notifyStory } = req.body;

      const [setting] = await Setting.findOrCreate({
        where: {
          userId: username,
        },
        defaults: {
          notifyLikePost,
          notifyLikeComment,
          notifyLikeCommentTree,
          notifyCommentPost,
          notifyCommentTree,
          notifyNewFollows,
          notifyStory,
        },
      });

      await setting.update({
        notifyLikePost,
        notifyLikeComment,
        notifyLikeCommentTree,
        notifyCommentPost,
        notifyCommentTree,
        notifyNewFollows,
        notifyStory,
      });

      return res.json({
        success: ["Configuração salva."],
      });
    } catch (error) {
      console.error("Error in SettingController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new SettingController();
