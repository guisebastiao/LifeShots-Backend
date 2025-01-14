import { Op } from "sequelize";
import UserLogin from "../models/UserLogin";

export const expirateUserLogin = async () => {
  try {
    const dateUTC = new Date().toISOString();

    const expirateLogin = await UserLogin.findAll({
      where: {
        expirate: {
          [Op.lt]: dateUTC,
        },
      },
    });

    expirateLogin.map(async (login) => {
      login.destroy();
    });
  } catch (error) {
    console.error("Error CRON expirateLogin", error);
  }
};
