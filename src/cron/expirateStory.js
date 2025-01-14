import { Op } from "sequelize";
import { resolve } from "path";
import fs from "fs";

import Story from "../models/Story";
import StoryImage from "../models/StoryImage";

export const expirateStory = async () => {
  try {
    const dateUTC = new Date().toISOString();

    const expirateStories = await Story.findAll({
      where: {
        expirate: {
          [Op.lt]: dateUTC,
        },
      },
    });

    expirateStories.map(async (story) => {
      const storyImage = await StoryImage.findAll({
        storyId: story.id,
      });

      storyImage.map((image) => {
        const { filename } = image;

        const filepath = resolve(__dirname, "../../uploads/storyImages/", filename);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        image.destroy();
      });

      story.destroy();
    });
  } catch (error) {
    console.error("Error CRON expirateStory", error);
  }
};
