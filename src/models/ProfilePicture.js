import Sequelize, { Model } from "sequelize";
import appConfig from "../config/appConfig";

export default class ProfilePicture extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          references: {
            model: "user",
            key: "username",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        originalname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        filename: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${appConfig.url_server}/profile-picture/${this.getDataValue("filename")}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "profilePicture",
    });
  }
}
