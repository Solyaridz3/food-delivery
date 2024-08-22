const setup =
    "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password CHAR(60), userRole VARCHAR(30))";

const register =
    "INSERT INTO users (name, email, password, userRole) VALUES ($1, $2, $3, $4)";

const getByEmail = "SELECT * FROM users WHERE email = $1";

const getById = "SELECT * FROM users WHERE id = $1";

const getAll = "SELECT * FROM users";

const updateUser = "UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1";

const updateName = "SET name = $1 WHERE id = $2";

const updatePassword = "SET password = $1 WHERE id = $2";

export default { setup, register, getByEmail, getAll, getById, updateUser };
