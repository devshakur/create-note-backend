import jwt from "jsonwebtoken";


export const generateToken = (userId, res) => {
  const expiresIn = process.env.EXPIRES_IN?.trim() || "7604800000";
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV?.trim() !== "development",
    maxAge: expiresIn,
    sameSite: "strict",
  });

  return token;
};
