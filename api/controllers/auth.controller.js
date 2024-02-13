import User from "../models/user.model.js";
import bycriptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = bycriptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(200).json({ message: "User Created Successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};