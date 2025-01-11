import Sequelize, { Model } from "sequelize";

export default class LikeStory extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        storyId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "story",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
      as: "userLikedStory",
    });

    this.belongsTo(models.Story, {
      foreignKey: "storyId",
      as: "likes",
    });
  }
}
