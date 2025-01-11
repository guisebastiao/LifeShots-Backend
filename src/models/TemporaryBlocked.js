import Sequelize, { Model } from "sequelize";

export default class TemporaryBlocked extends Model {
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
        blockingTime: {
          type: Sequelize.DATE,
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
