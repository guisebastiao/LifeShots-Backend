import Sequelize, { Model } from "sequelize";

export default class CommentPost extends Model {
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
        content: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        amountLikes: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        amountCommentTree: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "commentPost",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userComments",
    });

    this.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "postComments",
    });

    this.hasMany(models.LikeComment, {
      foreignKey: "commentId",
      as: "likes",
    });

    this.hasMany(models.CommentTree, {
      foreignKey: "commentId",
      as: "commentTree",
    });
  }
}
