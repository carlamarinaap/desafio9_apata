import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Bcrypt

import bcrypt from "bcrypt";
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);
