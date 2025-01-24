import { validationResult, body } from "express-validator";
import PostImage from "../models/PostImage";

export const validateRules = [
  body("content")
    .isString()
    .withMessage("Valor inválido.")
    .notEmpty()
    .withMessage("A descrição precisa ser preenchida.")
    .isLength({ max: 300 })
    .withMessage("A descrição tem que ser menor do que 300 caracteres."),
];

export const postValidate = (req, res, next) => {
  const errors = validationResult(req);
  const files = req.files || [];

  if (files.length <= 0) {
    return res.status(400).json({
      errors: [
        "Nenhuma imagem foi enviada. Pelo menos uma imagem é necessária.",
      ],
    });
  }

  if (files.length > 10) {
    return res.status(400).json({
      errors: ["É permitido 10 imagens por publicação."],
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

export const editPostValidate = async (req, res, next) => {
  const errors = validationResult(req);
  const files = req.files || [];
  const { postId } = req.params;

  const postImage = await PostImage.findAll({
    where: {
      postId,
    },
  });

  if (postImage.length + files.length > 10) {
    return res.status(400).json({
      errors: ["É permitido 10 imagens por publicação."],
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
