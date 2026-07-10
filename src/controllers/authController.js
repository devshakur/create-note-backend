import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { generateToken, clearAuthCookie } from "../utils/generateToken.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await prisma.user.findUnique({
    where: { email },
  });

  if (userExist) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: user,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ status: "success", message: "Logged out successfully" });
});

export default { register, login, logout };
