import { validationResult, body } from "express-validator";
import Story from "../models/Story";

export const validateRules = [
  body("content")
    .isString()
    .withMessage("Valor inválido.")
    .notEmpty()
    .withMessage("A descrição precisa ser preenchida.")
    .isLength({ max: 150 })
    .withMessage("A descrição tem que ser menor do que 150 caracteres."),
];

export const storyValidate = async (req, res, next) => {
  const errors = validationResult(req);
  const file = req.file;
  const { username } = req;

  const story = await Story.findAll({
    where: {
      userId: username,
    },
  });

  if (story.length > 15) {
    return res.status(400).json({
      errors: ["Você atingiu o limite dos seus stories."],
    });
  }

  if (!file) {
    return res.status(400).json({
      errors: ["Nenhuma imagem foi enviada."],
    });
  }

  if (!errors.isEmpty()) {
    const error = [];

    errors.array().map((err) => {
      error.push(err.msg);
    });

    return res.status(400).json({ errors: error });
  }

  next();
};

export const editStoryValidate = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = [];

    errors.array().map((err) => {
      error.push(err.msg);
    });

    return res.status(400).json({ errors: error });
  }

  next();
};
