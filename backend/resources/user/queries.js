const setup =
    "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password CHAR(60), userRole VARCHAR(30))";

const register =
    "INSERT INTO users (name, email, password, userRole) VALUES ($1, $2, $3, $4)";

const getByEmail = "SELECT * FROM users WHERE email = $1";

const getAll = "SELECT * FROM users";

export default { setup, register, getByEmail, getAll };
