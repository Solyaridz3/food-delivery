// Orders
const getAllOrders = "SELECT * FROM orders";

// Users
const deleteUser = "DELETE from users WHERE id = $1";

const getAllUsers = "SELECT id, name, email, phone, user_role FROM users";

// Items
const createItem =
    "INSERT INTO items (name, price, preparation_time, image_url) VALUES ($1, $2, $3, $4) RETURNING *";

const deleteItem = "DELETE from items WHERE id = $1";

// Drivers
const getAllDrivers = "SELECT * FROM drivers";

export default {
    deleteUser,
    getAllUsers,
    getAllOrders,
    createItem,
    getAllDrivers,
    deleteItem,
};
