import Sequelize, { Model } from "sequelize";

export default class Story extends Model {
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
        amountLikes: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(150),
          allowNull: false,
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
      foreignKey: "userId",
      as: "author",
    });

    this.hasMany(models.StoryImage, {
      foreignKey: "id",
      as: "storyImages",
    });

    this.hasMany(models.LikeStory, {
      foreignKey: "id",
      as: "likes",
    });
  }
}
