import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class UserPending extends Model {
  static init(sequelize) {
    super.init(
      {
        username: {
          type: Sequelize.STRING(50),
          primaryKey: true,
          unique: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        surname: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: Sequelize.STRING,
          defaultValue: "",
          allowNull: false,
        },
        password: {
          type: Sequelize.VIRTUAL,
          allowNull: false,
        },
        activeToken: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        expirate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "userPending",
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  passwordIsValid(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}
