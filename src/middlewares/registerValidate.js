import { validationResult, body } from "express-validator";

export const validateRules = [
  body("username")
    .isString()
    .withMessage("Valor inválido.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Seu nome de usuário deve possuir entre 3 a 50 caracteres.")
    .notEmpty()
    .withMessage("o nome de usuário precisa ser preenchido.")
    .custom((value) => !/\s/.test(value))
    .withMessage("O nome de usuário não pode ter espaços."),
  body("name")
    .isString()
    .withMessage("Valor inválido.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Seu nome deve possuir entre 3 a 50 caracteres.")
    .notEmpty()
    .withMessage("O nome precisa ser preenchido."),
  body("surname")
    .isString()
    .withMessage("Valor inválido.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Seu sobrenome deve possuir entre 3 a 50 caracteres.")
    .notEmpty()
    .withMessage("O sobrenome precisa ser preenchido."),
  body("email").isEmail().withMessage("E-mail inválido.").notEmpty().withMessage("O e-mail precisa ser preenchido."),
  body("password")
    .isString()
    .withMessage("Valor inválido.")
    .notEmpty()
    .withMessage("A senha precisa ser preenchida.")
    .isLength({ min: 8, max: 50 })
    .withMessage("A senha deve possuir entre 8 a 50 caracteres.")
    .matches(/[A-Z]/)
    .withMessage("A senha deve conter pelo menos uma letra maiúscula.")
    .matches(/\d.*\d/)
    .withMessage("A senha deve conter pelo menos dois números.")
    .matches(/[@$!%*?&#]/)
    .withMessage("A senha deve conter pelo menos um caractere especial."),
];

export const registerValidate = (req, res, next) => {
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
