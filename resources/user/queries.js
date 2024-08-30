const register =
    "INSERT INTO users (name, email, phone, password, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, user_role";

const getByEmail = "SELECT * FROM users WHERE email = $1";

const getById =
    "SELECT id, name, email, phone, password FROM users WHERE id = $1";

const updateUser =
    "UPDATE users SET name = $2, email = $3, phone = $4, password = $5 WHERE id = $1";

const registerAsAdmin = "UPDATE users SET user_role = 'admin' WHERE id = $1";

export default { register, getByEmail, getById, updateUser, registerAsAdmin };
