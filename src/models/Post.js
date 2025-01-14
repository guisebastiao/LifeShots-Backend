import Sequelize, { Model } from "sequelize";

export default class Post extends Model {
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
        content: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        amountLikes: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        amountComments: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "post",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
    });

    this.hasMany(models.PostImage, {
      foreignKey: "postId",
      as: "postImages",
    });

    this.hasMany(models.LikePost, {
      foreignKey: "postId",
      as: "likes",
    });

    this.hasMany(models.CommentPost, {
      foreignKey: "postId",
      as: "comments",
    });

    this.hasMany(models.CommentTree, {
      foreignKey: "postId",
      as: "postCommentSon",
    });
  }
}
