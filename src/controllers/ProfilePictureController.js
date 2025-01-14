import { extname, resolve, join } from "path";
import fs from "fs";

import { resizeImage } from "../utils/resizeImage";

import ProfilePicture from "../models/ProfilePicture";
import User from "../models/User";

class ProfilePictureController {
  async store(req, res) {
    try {
      const { username, file } = req;

      if (!file) {
        return res.status(400).json({
          errors: ["Nenhuma imagem foi enviada."],
        });
      }

      const existProfilePicture = await ProfilePicture.findByPk(username);

      if (existProfilePicture) {
        existProfilePicture.destroy();
      }

      const { originalname, buffer } = file;
      const random = Math.floor(Math.random() * 10000 + 10000);

      const filename = `${Date.now()}_${random}${extname(originalname)}`;
      const uploadDir = resolve(__dirname, "../../uploads/profilePictures/");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filepath = join(uploadDir, filename);

      await resizeImage({ buffer, filepath });

      const profilePicture = await ProfilePicture.create({
        originalname,
        filename,
        userId: username,
      });

      const user = await User.findByPk(username);
      user.update({ profilePicture: profilePicture.url });

      return res.json({
        success: ["Você adicionou uma foto no seu perfil."],
      });
    } catch (error) {
      console.error("Error in ProfilePictureController - Store", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async show(req, res) {
    try {
      const { username } = req;

      const profilePicture = await ProfilePicture.findByPk(username, {
        attributes: ["filename"],
      });

      if (!profilePicture) {
        return res.status(400).json({
          errors: ["Você não possui nenhuma foto de perfil."],
        });
      }

      return res.json({ profilePicture: profilePicture.url });
    } catch (error) {
      console.error("Error in ProfilePictureController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { username } = req;

      const profilePicture = await ProfilePicture.findByPk(username);

      if (!profilePicture) {
        return res.status(400).json({
          errors: ["Você não possui nenhuma foto de perfil."],
        });
      }

      const filepath = resolve(__dirname, "../../uploads/profilePictures/", profilePicture.filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      await profilePicture.destroy();

      return res.json({
        success: ["Você excluiu sua foto de perfil."],
      });
    } catch (error) {
      console.error("Error in ProfilePictureController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new ProfilePictureController();
