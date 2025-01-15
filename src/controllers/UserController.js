import { resolve } from "path";
import { literal } from "sequelize";
import fs from "fs";

import User from "../models/User";
import ProfilePicture from "../models/ProfilePicture";

class UserController {
  async show(req, res) {
    try {
      const { userId } = req.params;
      const { username } = req;

      const user = await User.findByPk(userId, {
        attributes: [
          "username",
          "name",
          "surname",
          "bio",
          "profilePicture",
          "privateAccount",
          "amountFollowing",
          "amountFollowers",
          "amountPosts",
          [literal(`(CASE WHEN :username = :userId THEN true ELSE false END)`), "isMyAccount"],
          [literal(`(SELECT CASE WHEN EXISTS(SELECT 1 FROM follow WHERE followingId = :username AND followerId = :userId) THEN true ELSE false END)`), "followingAccount"],
          [literal(`(SELECT CASE WHEN EXISTS(SELECT 1 FROM follow WHERE followingId = :userId AND followerId = :username) THEN true ELSE false END)`), "followedAccount"],
          [
            literal(
              `(SELECT CASE WHEN EXISTS (SELECT 1 FROM block WHERE (blockerId = :username AND blockedId = :userId) OR (blockerId = :userId AND blockedId = :username)) THEN true ELSE false END)`
            ),
            "isBlockedUser",
          ],
        ],
        replacements: {
          username,
          userId,
        },
      });

      return res.json(user);
    } catch (error) {
      console.error("Error in UserController - Show", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async update(req, res) {
    try {
      const { username } = req;
      const { bio, privateAccount, name, surname } = req.body;

      const user = await User.findByPk(username);

      await user.update({ bio, privateAccount, name, surname });

      return res.json({
        success: ["Perfil atualizado."],
      });
    } catch (error) {
      console.error("Error in UserController - Update", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }

  async delete(req, res) {
    try {
      const { username } = req;

      const user = await User.findByPk(username);

      const profilePicture = await ProfilePicture.findByPk(username);

      if (profilePicture) {
        const filepath = resolve(__dirname, "../../uploads/profilePictures/", profilePicture.filename);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        await profilePicture.destroy();
      }

      await user.destroy();

      return res.json({
        success: ["Sua conta foi delatada."],
      });
    } catch (error) {
      console.error("Error in UserController - Delete", error);

      return res.status(500).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }
  }
}

export default new UserController();
