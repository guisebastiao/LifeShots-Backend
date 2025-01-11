import { validationResult, body } from "express-validator";

export const validateRules = [
  body("content")
    .isString()
    .withMessage("Valor inválido.")
    .notEmpty()
    .withMessage("O seu comentário precisa ser preenchido.")
    .isLength({ max: 300 })
    .withMessage("O comentário tem que ser menor do que 300 caracteres."),
];

export const commentValidate = (req, res, next) => {
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
