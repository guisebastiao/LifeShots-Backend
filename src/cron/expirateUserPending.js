import { Op } from "sequelize";
import UserPending from "../models/UserPending";

export const expirateUserPending = async () => {
  try {
    const dateUTC = new Date().toISOString();

    const expirateUserPending = await UserPending.findAll({
      where: {
        expirate: {
          [Op.lt]: dateUTC,
        },
      },
    });

    expirateUserPending.map(async (userPending) => {
      userPending.destroy();
    });
  } catch (error) {
    console.error("Error CRON expirate userPending", error);
  }
};
