import pool from "../db.js";
import bcrypt from "bcryptjs";
import token from "../utils/token.js";

class UserService {
    getUsers = async () => {
        const data = await pool.query("SELECT * FROM users");
        return data;
    };

    setup = async () => {
        await pool.query(
            "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), password CHAR(60), userRole VARCHAR(30))"
        );
    };

    createUser = async (name, location) => {
        await pool.query("INSERT INTO users (name, address) VALUES ($1, $2)", [
            name,
            location,
        ]);
    };

    register = async (name, email, password, userRole) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        console.log(hashedPassword.length);
        await pool.query(
            "INSERT INTO users (name, email, password, userRole) VALUES ($1, $2, $3, $4)",
            [name, email, hashedPassword, userRole]
        );

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const createdUser = result.rows[0];

        const accessToken = token.createToken(createdUser);

        return accessToken;
    };

    login = async (email, password) => {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

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
