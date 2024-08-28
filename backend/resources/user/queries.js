const setup =
    "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password CHAR(60) NOT NULL, phone VARCHAR(20) UNIQUE NOT NULL, user_role VARCHAR(30))";

const register =
    "INSERT INTO users (name, email, phone, password, user_role) VALUES ($1, $2, $3, $4, $5)";

const getByEmail = "SELECT * FROM users WHERE email = $1";

const getById = "SELECT id, name, email, phone, password FROM users WHERE id = $1";

const getAll = "SELECT id, name, email, phone, user_role FROM users";

const updateUser =
    "UPDATE users SET name = $2, email = $3, phone = $4, password = $5 WHERE id = $1";

export default { setup, register, getByEmail, getAll, getById, updateUser };
