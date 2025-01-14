import { validationResult, body } from "express-validator";

export const validateRules = [
  body("password")
    .isString()
    .withMessage("Valor inválido.")
    .notEmpty()
    .withMessage("A senha precisa ser preenchida.")
    .isLength({ min: 8, max: 50 })
    .withMessage("A senha deve possuir entre 8 a 50 caracteres.")
    .matches(/(?=.*[A-Z])(?=.*\d.*\d)(?=.*[@$!%*?&#])/)
    .withMessage("A senha deve conter pelo menos uma letra maiúscula, dois números e um caractere especial."),
];

export const resetPasswordValidate = (req, res, next) => {
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
