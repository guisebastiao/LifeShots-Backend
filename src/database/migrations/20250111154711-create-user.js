"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      username: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activeToken: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      bio: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      amountFollowing: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      amountFollowers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      amountPosts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      privateAccount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      temporaryBlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("user");
  },
};
