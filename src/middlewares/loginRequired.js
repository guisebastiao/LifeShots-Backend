import jwt from "jsonwebtoken";
import User from "../models/User";

export default async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      res.setHeader("authenticated", false);

      return res.status(401).json({
        errors: ["Você precisa fazer o login."],
      });
    }

    const { username, email } = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findOne({
      where: { username, email },
    });

    if (!user) {
      res.setHeader("authenticated", false);

      return res.status(401).json({
        errors: ["Você precisa fazer o login."],
      });
    }

    req.username = username;
    req.email = email;

    res.setHeader("authenticated", true);

    return next();
  } catch (error) {
    res.setHeader("authenticated", false);

    return res.status(401).json({
      errors: ["Sessão expirada, faça seu login"],
    });
  }
};
