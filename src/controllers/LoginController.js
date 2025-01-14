import nodemailer from "nodemailer";
import UserPending from "../models/UserPending";
import UserLogin from "../models/UserLogin";
import User from "../models/User";

import appConfig from "../config/appConfig";
import { loginCode } from "../../public/emails/loginCode";
import { registerActive } from "../../public/emails/registerActive";

class LoginController {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      const existingUserPending = await UserPending.findOne({
        where: { email },
      });

      if (existingUserPending) {
        const userPending = existingUserPending.passwordIsValid(password);

        if (userPending) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          const { activeToken } = existingUserPending.dataValues;

          const activeLink = `${appConfig.url_site}/active-account/${activeToken}`;

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Clique no link para ativar sua conta.",
            html: registerActive({ activeLink }),
          };

          await transporter.sendMail(mailOptions);

          return res.status(401).json({
            errors: ["Você precisa ativar sua conta, um e-mail foi enviado novamente para você poder ativar sua conta."],
          });
        }
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          errors: ["Senha ou E-mail inválidos."],
        });
      }

      const passwordIsValid = await user.passwordIsValid(password);

      if (!passwordIsValid) {
        return res.status(401).json({
          errors: ["Senha ou E-mail inválidos."],
        });
      }

      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");

      const userLogin = await UserLogin.findOne({
        where: {
          userId: user.dataValues.username,
        },
      });

      if (userLogin) {
        await userLogin.destroy();
      }

      const date = new Date();
      date.setMinutes(date.getMinutes() + 15);
      const expirate = date.toISOString();

      const { tokenId } = await UserLogin.create({
        userId: user.dataValues.username,
        code,
        expirate,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Código de Verificação para Login - LifeShots",
        html: loginCode({ code }),
      };

      await transporter.sendMail(mailOptions);

      return res.json({
        success: ["Um código foi enviado para seu e-mail."],
        token: tokenId,
      });
    } catch (error) {
      console.error("Error in LoginController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new LoginController();
