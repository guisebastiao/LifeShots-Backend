import Sequelize, { Model } from "sequelize";

export default class LikeCommentTree extends Model {
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
        commentTreeId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "CommentTree",
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
      as: "userLikedCommentTree",
    });

    this.belongsTo(models.CommentTree, {
      foreignKey: "commentTreeId",
      as: "likes",
    });
  }
}
