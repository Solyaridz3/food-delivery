import pool from "../../db.js";
import bcrypt from "bcryptjs";
import token from "../../utils/token.js";
import queries from "./queries.js";

class UserService {
    getUsers = async () => {
        const data = await pool.query(queries.getAll);
        return data;
    };

    setup = async () => {
        await pool.query(queries.setup);
    };

    findUser = async (id) => {
        const user = await pool.query(queries.getById, [id]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    };

    register = async (name, email, phone, password, userRole) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(queries.register, [
            name,
            email,
            phone,
            hashedPassword,
            userRole,
        ]);

        const result = await pool.query(queries.getByEmail, [email]);

        const createdUser = result.rows[0];

        const accessToken = token.createToken(createdUser);

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

            const isPasswordValid = await bcrypt.compare(
                data.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new Error("You entered invalid password");
            }

            if (data.new_password) {
                const hash = await bcrypt.hash(data.password, 10);
                user.password = hash;
            }

            if (data.email) {
                user.email = data.email;
            }

            if (data.name) {
                user.name = data.name;
            }
            if (data.phone) {
                user.phone = data.phone;
            }

            await pool.query(queries.updateUser, Object.values(user));

            const { password, ...newUserData } = user; // in order to omit password

            return newUserData;
        } catch (error) {
            throw new Error(
                error.message ||
                    "Unable to update user, please check again given information."
            );
        }
    };
}

export default UserService;
