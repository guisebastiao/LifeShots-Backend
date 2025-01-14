import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const [_, token] = authorization.split(" ");

    if (!token) {
      return res.status(401).json({
        errors: ["Você precisa fazer o login."],
      });
    }

    const { username, email } = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findOne({
      where: { username, email },
    });

    if (!user) {
      return res.status(401).json({
        errors: ["Você precisa fazer o login."],
      });
    }

    req.username = username;
    req.email = email;

    return next();
  } catch (error) {
    return res.status(401).json({
      errors: ["Sessão expirada, faça seu login"],
    });
  }
};
