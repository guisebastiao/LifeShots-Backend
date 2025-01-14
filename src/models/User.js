import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
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
        password: {
          type: Sequelize.VIRTUAL,
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
        profilePicture: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        temporaryBlocked: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user",
      }
    );

    this.addHook("beforeSave", async (user) => {
      user.passwordHash = await bcrypt.hash(user.password, 8);
    });

    return this;
  }

  passwordIsValid(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  static associate(models) {
    this.hasOne(models.TemporaryBlocked, {
      foreignKey: "userId",
      as: "temporaryBlock",
    });

    this.hasOne(models.Setting, {
      foreignKey: "userId",
      as: "settings",
    });

    this.hasOne(models.ProfilePicture, {
      foreignKey: "userId",
      as: "profilePictureUser",
    });

    this.hasOne(models.UserLogin, {
      foreignKey: "tokenId",
      as: "userLogin",
    });

    this.hasOne(models.ResetPassword, {
      foreignKey: "tokenId",
      as: "resetPassword",
    });

    this.hasMany(models.Block, {
      foreignKey: "blockerId",
      as: "blocker",
    });

    this.hasMany(models.Block, {
      foreignKey: "blockedId",
      as: "blocked",
    });

    this.hasMany(models.Follow, {
      foreignKey: "followingId",
      as: "following",
    });

    this.hasMany(models.Follow, {
      foreignKey: "followerId",
      as: "followers",
    });

    this.hasMany(models.Post, {
      foreignKey: "userId",
      as: "posts",
    });

    this.hasMany(models.LikePost, {
      foreignKey: "userId",
      as: "userLikedPost",
    });

    this.hasMany(models.CommentPost, {
      foreignKey: "userId",
      as: "comments",
    });

    this.hasMany(models.LikeComment, {
      foreignKey: "userId",
      as: "userLikedComment",
    });

    this.hasMany(models.CommentTree, {
      foreignKey: "userId",
      as: "userCommentsTree",
    });

    this.hasMany(models.Story, {
      foreignKey: "userId",
      as: "stories",
    });

    this.hasMany(models.LikeStory, {
      foreignKey: "userId",
      as: "userLikedStory",
    });

    this.hasMany(models.Notification, {
      foreignKey: "recipientId",
      as: "recipient",
    });

    this.hasMany(models.Notification, {
      foreignKey: "senderId",
      as: "sender",
    });
  }
}
