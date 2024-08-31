CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    password CHAR(60) NOT NULL, 
    phone VARCHAR(20) UNIQUE NOT NULL, 
    user_role VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(id), 
    status VARCHAR(30) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY, 
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL, 
    preparation_time INT NOT NULL, 
    image_url VARCHAR(2083) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    order_total DECIMAL(10,2) NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'pending', 
    delivery_time VARCHAR(10) NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    item_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id), 
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);