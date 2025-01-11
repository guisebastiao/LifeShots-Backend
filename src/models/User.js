import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class User extends Model {
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
          allowNull: false,
        },
        activeToken: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        bio: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        amountFollowing: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        amountFollowers: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        amountPosts: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        privateAccount: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        profilePicture: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        temporaryBlocked: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user) => {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 8);
    });

    return this;
  }

  passwordIsValid(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}
