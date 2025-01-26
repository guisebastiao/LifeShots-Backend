import Sequelize, { Model } from "sequelize";
import appConfig from "../config/appConfig";

export default class PostImage extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
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
            return `${appConfig.url_server}/post-images/${this.getDataValue(
              "filename"
            )}`;
          },
        },
      },
      {
        sequelize,
        tableName: "postImage",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "post",
    });
  }
}
