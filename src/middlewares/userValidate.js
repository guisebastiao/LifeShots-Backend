import { validationResult, body } from "express-validator";

export const validateRules = [
  body("bio")
    .optional()
    .isString()
    .withMessage("Valor inválido.")
    .isLength({ max: 150 })
    .withMessage("A bigrafia tem que ser menor do que 150 caracteres."),
  body("name").optional().isString().withMessage("Valor inválido."),
  body("surname").optional().isString().withMessage("Valor inválido."),
];

export const userValidate = (req, res, next) => {
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
