import dotenv from "dotenv";

const environment = "DEVELOPMENT";

dotenv.config({
  path: environment === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
});

export default {
  mongoUrl: process.env.MONGO_URL,
  adminFirstName: process.env.ADMIN_FIRST_NAME,
  adminLastName: process.env.ADMIN_LAST_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  privateKey: process.env.PRIVATE_KEY,
};
