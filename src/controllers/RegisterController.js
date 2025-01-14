import nodemailer from "nodemailer";
import UserPending from "../models/UserPending";
import User from "../models/User";

import { registerActive } from "../../public/emails/registerActive";
import appConfig from "../config/appConfig";

class RegisterController {
  async store(req, res) {
    try {
      const { username, name, surname, email, password } = req.body;

      const existingUserPending = await UserPending.findOne({
        where: {
          username,
        },
      });

      const existingUser = await User.findOne({
        where: {
          username,
        },
      });

      if (existingUserPending || existingUser) {
        return res.status(400).json({
          errors: ["Esse usuário já existe."],
        });
      }

      const date = new Date();
      date.setMinutes(date.getMinutes() + 15);
      const expirate = date.toISOString();

      const { activeToken } = await UserPending.create({
        username,
        name,
        surname,
        email,
        password,
        expirate,
      });

      const activeLink = `${appConfig.url_site}/active-account/${activeToken}`;

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
        subject: "Clique no link para ativar sua conta.",
        html: registerActive({ activeLink }),
      };

      await transporter.sendMail(mailOptions);

      return res.json({
        success: ["Você precisa verificar sua conta."],
      });
    } catch (error) {
      console.error("Error in RegisterController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new RegisterController();
