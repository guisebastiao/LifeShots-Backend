import { multerConfig } from "../config/multerConfig";
const upload = multerConfig.array("postImages");

export const uploadPostsImages = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          errors: ["As imagens da publicação não pode ser maior do que 5MB."],
        });
      }

      return res.status(400).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }

    next();
  });
};
