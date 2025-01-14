import { Op } from "sequelize";
import TemporaryBlocked from "../models/TemporaryBlocked";
import User from "../models/User";

export const expirateUserBlocked = async () => {
  try {
    const dateUTC = new Date().toISOString();

    const expirateUsers = await TemporaryBlocked.findAll({
      where: {
        blockingTime: {
          [Op.lte]: dateUTC,
        },
      },
    });

    expirateUsers.map(async (user) => {
      const { userId } = user;
      const userBlocked = await User.findByPk(userId);
      userBlocked.update({ temporaryBlocked: false, failedAttempts: 0 });
      user.destroy();
    });
  } catch (error) {
    console.error("Error CRON expirate user blockedTemporary", error);
  }
};
