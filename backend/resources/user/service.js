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

    register = async (name, email, password, userRole) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(queries.register, [
            name,
            email,
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

        const accessToken = toke.createToken(user);

        return accessToken;
    };
}

export default UserService;
