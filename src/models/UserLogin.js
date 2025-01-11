import Sequelize, { Model } from "sequelize";

export default class UserLogin extends Model {
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
            model: "users",
            key: "username",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        code: {
          type: Sequelize.CHAR(6),
          allowNull: true,
          defaultValue: null,
        },
        failedAttempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
      as: "userLogin",
    });
  }
}
