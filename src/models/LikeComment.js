import Sequelize, { Model } from "sequelize";

export default class LikeComment extends Model {
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
        commentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "commentPost",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "likeComment",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userLikedComment",
    });

    this.belongsTo(models.CommentPost, {
      foreignKey: "commentId",
      as: "likes",
    });
  }
}
