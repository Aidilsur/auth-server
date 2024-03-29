import User from "../models/user.model.js";
import bycriptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bycriptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(200).json({ message: "User Created Successfully" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    const validPassword = bycriptjs.compareSync(password, validUser.password);
    const expireDate = new Date(Date.now() + 3600000); // 1 hour
    if (!validUser) return next(errorHandler(404, "User not found"));
    if (!validPassword) return next(401, "wrong credential");

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashPassword, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true, expires: expireDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ jd: user._id }, process.env.JWT_SECRET);
      const { password: hashPassword, ...rest } = user._docs;
      const expireDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashPassword = bycriptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.user.email,
        password: hashPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ jd: user._id }, process.env.JWT_SECRET);
      const { password: hashPassword2, ...rest } = user._docs;
      const expireDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
