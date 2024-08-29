const deleteUser = "DELETE from users WHERE id = $1";

const getAllUsers = "SELECT id, name, email, phone, user_role FROM users";

const getAllOrders = "SELECT * FROM orders";

export default { deleteUser, getAllUsers, getAllOrders };
