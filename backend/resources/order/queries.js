const setup =
    "CREATE TABLE orders (order_id SERIAL PRIMARY KEY, user_id INT NOT NULL, order_total DECIMAL(10,2) NOT NULL, delivery_status VARCHAR(20) NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))";

const create =
    "INSERT INTO orders (user_id, order_total, delivery_status) VALUES ($1, $2, $3) RETURNING order_id;";

const getOne = "SELECT * FROM orders WHERE order_id = $1";

const getUserOrders = "SELECT * FROM orders WHERE user_id = $1";

export default { setup, create };
