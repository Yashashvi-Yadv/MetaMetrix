import jwt from "jsonwebtoken";

export const signJWT = (payload, secret, options = {}) =>
  jwt.sign(payload, secret, options);

export const verifyJWT = (token, secret) => jwt.verify(token, secret);
