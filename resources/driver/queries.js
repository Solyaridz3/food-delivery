const registerDriver = "INSERT into drivers (user_id) VALUES ($1) RETURNING *";

const changeStatus =
    "UPDATE drivers SET status = $1 WHERE user_id = $2 RETURNING status";

const getAvailableDrivers = "SELECT * FROM drivers WHERE status = 'available'";

const setUserDriverStatus = "UPDATE users SET user_role = 'driver' WHERE id = $1"

export default {
    registerDriver,
    changeStatus,
    getAvailableDrivers,
    setUserDriverStatus
};
