import pool from "../../db.js";
import bcrypt from "bcryptjs";
import token from "../../utils/token.js";
import queries from "./queries.js";

class UserService {

    findUser = async (id) => {
        const user = await pool.query(queries.getById, [id]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    };

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

        const accessToken = token.createToken(user);

        return accessToken;
    };

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

    delete = async (id) => {
        try {
        } catch {
            throw new Error("Unable to delete user or user does not exist");
        }
    };

    update = async (data) => {
        try {
            const queryResult = await pool.query(queries.getById, [data.id]);

            if (queryResult.rows.length === 0) {
                throw new Error("Error occurred: Unable to find your profile");
            }

            const user = queryResult.rows[0];

            // Check if the current password is correct
            const isPasswordValid = await bcrypt.compare(
                data.password,
                user.password
            );
            if (!isPasswordValid) {
                throw new Error("You entered an invalid password");
            }

            const updatedFields = {};

            if (data.new_password) {
                updatedFields.password = await bcrypt.hash(
                    data.new_password,
                    10
                );
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
                newUser.name,
                newUser.email,
                newUser.phone,
                newUser.password,
                newUser.id,
            ]);

            const { password, ...newUserData } = newUser;
            return newUserData;
        } catch (error) {
            throw new Error(
                error.message ||
                    "Unable to update user, please check the provided information."
            );
        }
    };
}

export default UserService;
