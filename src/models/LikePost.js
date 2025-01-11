import Sequelize, { Model } from "sequelize";

export default class LikePost extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
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
        postId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "post",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
      as: "userLikedPost",
    });

    this.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "likes",
    });
  }
}
