// Orders
const getAllOrders = "SELECT * FROM orders";

const updateOrderStatus =
  "UPDATE orders SET delivery_status = $1 WHERE id = $2 RETURNING *";

const deleteOrder = "DELETE from orders WHERE id = $1";

// Users

const deleteUserRelatedDriver = "DELETE FROM drivers where user_id = $1";
const deleteUser = "DELETE FROM users WHERE id = $1";

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
  deleteUserRelatedDriver,
  updateOrderStatus,
  deleteOrder,
};
