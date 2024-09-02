const insertOrderItems =
  "INSERT INTO order_items (order_id, item_id, quantity, item_price) VALUES ($1, $2, $3, $4)";

const create =
  "INSERT INTO orders (user_id, driver_id, order_total, delivery_time) VALUES ($1, $2, $3, $4) RETURNING id;";

const getOrderById = "SELECT * FROM orders WHERE id = $1";

const getUserOrders = "SELECT * FROM orders WHERE user_id = $1";

const setDelivered = "UPDATE orders SET delivery_status = $1 WHERE id = $2";

const getItemsData =
  "SELECT id, price, preparation_time FROM items WHERE id = ANY($1::int[])";

const getOrderItems =
  "SELECT item_id, quantity, item_price from order_items WHERE order_id = $1";

export default {
  create,
  getOrderById,
  setDelivered,
  getUserOrders,
  getOrderItems,
  insertOrderItems,
  getItemsData,
};
