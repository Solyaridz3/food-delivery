const setup =
    "CREATE TABLE orders (order_id SERIAL PRIMARY KEY, user_id INT NOT NULL, driver_id INT NOT NULL, order_total DECIMAL(10,2) NOT NULL, delivery_status VARCHAR(20) DEFAULT 'pending', delivery_time VARCHAR(10) NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (driver_id) REFERENCES drivers(driver_id))";

const setupOrderItems =
    "CREATE TABLE order_items (order_item_id SERIAL PRIMARY KEY, order_id INT NOT NULL, item_id INT NOT NULL,  quantity INT NOT NULL DEFAULT 1, item_price DECIMAL(10,2) NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (item_id) REFERENCES items(item_id))";

const create =
    "INSERT INTO orders (user_id, driver_id, order_total, delivery_time) VALUES ($1, $2, $3, $4) RETURNING order_id;";

const getOne = "SELECT * FROM orders WHERE order_id = $1";

const getUserOrders = "SELECT * FROM orders WHERE user_id = $1";

const setDelivered =
    "UPDATE orders SET delivery_status = $1 WHERE order_id = $2";

const getOrderItems =
    "SELECT item_id, quantity, item_price from order_items WHERE order_id = $1";

export default {
    setup,
    create,
    getOne,
    setDelivered,
    getUserOrders,
    setupOrderItems,
    getOrderItems,
};
