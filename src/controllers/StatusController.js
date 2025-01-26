class StatusController {
  async show(_req, res) {
    try {
      return res.json({
        message: ["API is running"],
      });
    } catch (error) {
      console.error("Error in StatusController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new StatusController();
