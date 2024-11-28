import pool from "../../db.js";
import bcrypt from "bcryptjs";
import token from "../../utils/token.js";
import queries from "./queries.js";

// Handles user-related operations
class UserService {
  // Registers a new user
  // @param {string} name - User's name
  // @param {string} email - User's email
  // @param {string} phone - User's phone number
  // @param {string} password - User's password
  // @param {string} userRole - User's role (e.g., 'user', 'admin')
  // @returns {string} - Access token for the registered user
  register = async (name, email, phone, password, userRole) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryResult = await pool.query(queries.register, [
      name,
      email,
      phone,
      hashedPassword,
      userRole,
    ]);

    const user = queryResult.rows[0];
    const userId = user.id;

    // If the first user registers, make them an admin
    if (userId === 1) {
      await pool.query(queries.registerAsAdmin, [userId]);
      userRole = "admin";
    }

    const accessToken = token.createToken({
      id: userId,
      user_role: userRole,
    });
    return accessToken;
  };

  // Logs in an existing user
  // @param {string} email - User's email
  // @param {string} password - User's password
  // @returns {string} - Access token for the logged-in user
  login = async (email, password) => {
    const result = await pool.query(queries.getByEmail, [email]);

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const accessToken = token.createToken(user);

    return accessToken;
  };

  // Updates an existing user's information
  // @param {object} data - Object containing user update data
  // @returns {object} - Updated user data (excluding password)
  update = async (data) => {
    try {
      const queryResult = await pool.query(queries.getById, [data.id]);

      if (queryResult.rows.length === 0) {
        throw new Error("Error occurred: Unable to find your profile");
      }

      const user = queryResult.rows[0];

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new Error("You entered an invalid password");
      }

      const updatedFields = {};

      // Update password if new password is provided
      if (data.new_password) {
        updatedFields.password = await bcrypt.hash(data.new_password, 10);
      }

      if (data.email) {
        updatedFields.email = data.email;
      }

      if (data.name) {
        updatedFields.name = data.name;
      }

      if (data.phone) {
        updatedFields.phone = data.phone;
      }

      if (Object.keys(updatedFields).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const newUser = { ...user, ...updatedFields };

      await pool.query(queries.updateUser, [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.phone,
        newUser.password,
      ]);

      const { password, ...newUserData } = newUser;
      return newUserData;
    } catch (error) {
      throw new Error(
        error.message ||
          "Unable to update user, please check the provided information.",
      );
    }
  };
}

export default UserService;
