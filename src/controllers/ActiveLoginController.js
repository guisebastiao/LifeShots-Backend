import User from "../models/User";
import UserLogin from "../models/UserLogin";
import TemporaryBlocked from "../models/TemporaryBlocked";
import Setting from "../models/Setting";
import jwt from "jsonwebtoken";

class ActiveLoginController {
  async store(req, res) {
    try {
      const { code: loginCode, token } = req.body;

      if (!loginCode || !token) {
        return res.status(400).json({
          errors: ["Sessão inválida."],
        });
      }

      const userLogin = await UserLogin.findByPk(token);

      if (!userLogin) {
        return res.status(400).json({
          errors: ["Login expirado, faça o login novamente."],
        });
      }

      const user = await User.findOne({
        where: { username: userLogin.userId },
      });

      if (!user) {
        return res.status(400).json({
          errors: ["Algo deu errado, tente novamente mais tarde."],
        });
      }

      if (user.dataValues.temporaryBlocked) {
        return res.status(401).json({
          errors: ["Você está bloqueado por 15 minutos por excesso de tentativas consecutivas para concluir o login."],
        });
      }

      if (userLogin.failedAttempts >= 5) {
        await user.update({ temporaryBlocked: true });
        userLogin.destroy();

        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        const blockingTime = date.toISOString();

        await TemporaryBlocked.create({
          userId: user.dataValues.username,
          blockingTime,
        });

        return res.status(401).json({
          errors: ["Você está bloqueado por 15 minutos, por excesso de tentativas consecutivas ao tentar fazer o login."],
        });
      }

      if (userLogin.code === loginCode) {
        const token = jwt.sign({ username: user.dataValues.username, email: user.dataValues.email }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });

        await userLogin.destroy();

        await Setting.findOrCreate({
          where: {
            userId: userLogin.userId,
          },
        });

        return res.json({ username: user.username, token });
      } else {
        await userLogin.update({
          failedAttempts: userLogin.failedAttempts + 1,
        });

        return res.status(401).json({
          errors: ["Esse código fornecido está incorreto."],
        });
      }
    } catch (error) {
      console.error("Error in ActiveLoginController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new ActiveLoginController();
