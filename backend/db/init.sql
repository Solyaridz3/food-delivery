-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_role VARCHAR(20) NOT NULL CHECK (
        user_role IN ('user', 'admin', 'driver')
    )
);

-- Table: drivers
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (
        status IN ('available', 'delivering', 'unavailable')
    ) DEFAULT 'available'
);

-- Table: items
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description VARCHAR(2083) NOT NULL,
    preparation_time INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(2083) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    driver_id INT REFERENCES drivers(id),
    order_total DECIMAL(10, 2) NOT NULL,
    delivery_status VARCHAR(20) NOT NULL CHECK (
        delivery_status IN ('pending', 'confirmed', 'delivered', 'canceled')
    ) DEFAULT 'pending',
    delivery_time VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL
);
