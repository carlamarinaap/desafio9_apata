import { createHash, isValidPassword } from "../utils.js";
import UserSchema from "../dao/user.schema.js";

class UserManager {
  addUser = async (user) => {
    try {
      user.password = createHash(user.password);
      return await new UserSchema(user).save();
    } catch (error) {
      throw new Error(`Error al agregar el usuario: ${error.message}`);
    }
  };

  getUser = async (email) => {
    return await UserSchema.findOne({ email });
  };

  getUserByCreds = async (email, password) => {
    try {
      let user = await UserSchema.findOne({ email });
      if (user) {
        if (isValidPassword(password, user.password)) {
          delete user.password;
          return user;
        } else {
          throw new Error("Usuario o contraseña incorrecta");
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updatePassword = async (email, password) => {
    try {
      await UserSchema.findOneAndUpdate(
        { email: email },
        { $set: { password: createHash(password) } },
        { new: true }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default UserManager;
