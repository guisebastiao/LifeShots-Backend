import Sequelize, { Model } from "sequelize";

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
      },
      {
        sequelize,
      }
    );

    return this;
  }
}
