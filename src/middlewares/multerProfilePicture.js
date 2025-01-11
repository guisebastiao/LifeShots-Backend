import { multerConfig } from "../config/multerConfig";
const upload = multerConfig.single("profilePicture");

export const uploadProfilePicture = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          errors: ["A foto de perfil não pode ser maior do que 5MB."],
        });
      }

      return res.status(400).json({
        errors: ["Algo deu errado, tente novamente mais tarde."],
      });
    }

    next();
  });
};
