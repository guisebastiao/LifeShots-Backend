import Sequelize, { Model } from "sequelize";

export default class Setting extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          unique: true,
          references: {
            model: "user",
            key: "username",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        notifyLikePost: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyLikeComment: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyLikeCommentTree: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyCommentPost: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyCommentTree: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyNewFollows: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        notifyStory: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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
