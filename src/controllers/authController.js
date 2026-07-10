import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  //chseck if user exists
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  //Hased password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    data: { id: user.id, name: user.name, email: user.email },
    token,
  });
};
const logout = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: "success", message: "Logged out successfully" });
};
export default { register, login, logout };
