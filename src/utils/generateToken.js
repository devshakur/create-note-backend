import jwt from "jsonwebtoken";

const parseExpiryToMs = (expiry) => {
  const value = String(expiry || "7d").trim();
  const match = value.match(/^(\d+)([dhms])$/i);

  if (!match) {
    const asNumber = Number(value);
    return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };

  return amount * multipliers[unit];
};

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV?.trim() === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge,
});

export const generateToken = (userId, res) => {
  const expiresIn = process.env.EXPIRES_IN?.trim() || "7d";
  const maxAge = parseExpiryToMs(expiresIn);
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET.trim(), {
    expiresIn: Math.floor(maxAge / 1000),
  });

  res.cookie("jwt", token, cookieOptions(maxAge));
  return token;
};

export const clearAuthCookie = (res) => {
  res.cookie("jwt", "", {
    ...cookieOptions(0),
    expires: new Date(0),
  });
};
