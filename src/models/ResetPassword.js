import Sequelize, { Model } from "sequelize";

export default class ResetPassword extends Model {
  static init(sequelize) {
    super.init(
      {
        tokenId: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        userId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "user",
            key: "username",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        expirate: {
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

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "tokenId",
      as: "resetPassword",
    });
  }
}
