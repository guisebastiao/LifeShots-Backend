"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("setting", {
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("setting");
  },
};
