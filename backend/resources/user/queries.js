const setup =
    "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password CHAR(60) NOT NULL, phone VARCHAR(20) UNIQUE, user_role VARCHAR(30))";

const register =
    "INSERT INTO users (name, email, password, user_role) VALUES ($1, $2, $3, $4)";

const getByEmail = "SELECT * FROM users WHERE email = $1";

const getById = "SELECT * FROM users WHERE id = $1";

const getAll = "SELECT * FROM users";

const updateUser =
    "UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1";

const updateName = "SET name = $1 WHERE id = $2";

const updatePassword = "SET password = $1 WHERE id = $2";

export default { setup, register, getByEmail, getAll, getById, updateUser };
