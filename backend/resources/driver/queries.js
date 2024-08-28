const setup =
    "CREATE TABLE drivers (driver_id SERIAL PRIMARY KEY, user_id INT UNIQUE NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), status VARCHAR(30) DEFAULT 'available')";

const registerDriver = "INSERT into drivers (user_id) VALUES ($1) RETURNING *";

const changeStatus =
    "UPDATE drivers SET status = $1 WHERE user_id = $2 RETURNING status";

const getAvailableDrivers = "SELECT * FROM drivers WHERE status = 'available'";

const getAllDrivers = "SELECT * FROM drivers";

const setUserDriverStatus = "UPDATE users SET user_role = 'driver' WHERE id = $1"

export default {
    setup,
    registerDriver,
    changeStatus,
    getAvailableDrivers,
    getAllDrivers,
    setUserDriverStatus
};
