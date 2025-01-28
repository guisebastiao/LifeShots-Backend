import User from "../models/User";
import ResetPassword from "../models/ResetPassword";

import nodemailer from "nodemailer";

import { passwordReset } from "../../public/emails/passwordReset";
import appConfig from "../config/appConfig";

class ResetPasswordController {
  async store(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: ["E-mail fornecido está incorreto."],
        });
      }

      const date = new Date();
      date.setMinutes(date.getHours() + 1);
      const expirate = date.toISOString();

      const { tokenId } = await ResetPassword.create({
        userId: user.username,
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

      const resetLink = `${appConfig.url_site}/reset-password/${tokenId}`;

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email para redefinir sua senha.",
        html: passwordReset({ resetLink }),
      };

      await transporter.sendMail(mailOptions);

      return res.json({
        success: [
          "Um email foi enviado para redefinir sua senha, por favor, verifique seu email.",
        ],
      });
    } catch (error) {
      console.error("Error in ResetPasswordController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.params;

      const resetPassword = await ResetPassword.findByPk(token);

      if (!resetPassword) {
        return res.status(400).json({
          errors: [
            "A troca de senha se expirou ou a sessão é invalida, clique para troca-la novamente.",
          ],
        });
      }

      const user = await User.findByPk(resetPassword.userId);
      await user.update({ password });

      await resetPassword.destroy();

      return res.json({
        success: ["Sua senha foi atualizada."],
      });
    } catch (error) {
      console.error("Error in ResetPasswordController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new ResetPasswordController();
