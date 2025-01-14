import UserPending from "../models/UserPending";
import Setting from "../models/Setting";
import User from "../models/User";
import jwt from "jsonwebtoken";

class ActiveAccountController {
  async store(req, res) {
    try {
      const { activeToken } = req.body;

      const userPending = await UserPending.findOne({
        where: { activeToken },
      });

      if (!userPending) {
        return res.status(400).json({
          errors: ["Algo deu errado, tente novamente mais tarde."],
        });
      }

      const { username } = await User.create(
        {
          ...userPending.dataValues,
          password: userPending.dataValues.passwordHash,
        },
        {
          hooks: false,
        }
      );

      await userPending.destroy();

      const user = await User.findByPk(username);

      const token = jwt.sign({ username: username, email: user.email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      await Setting.findOrCreate({
        where: {
          userId: username,
        },
      });

      return res.json({ username, token });
    } catch (error) {
      console.error("Error in ActiveAccountController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new ActiveAccountController();
