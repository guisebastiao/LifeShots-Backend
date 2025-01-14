import Sequelize, { Model } from "sequelize";
import appConfig from "../config/appConfig";

export default class StoryImage extends Model {
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
        originalname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        filename: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${appConfig.url_server}/story-images/${this.getDataValue("filename")}`;
          },
        },
      },
      {
        sequelize,
        tableName: "storyImage",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Story, {
      foreignKey: "id",
      as: "storyImages",
    });
  }
}
