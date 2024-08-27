const setup =
    "CREATE TABLE items (item_id SERIAL PRIMARY KEY, item_name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, preparation_time INT NOT NULL, image_url VARCHAR(2083) NOT NULL)";

const create =
    "INSERT INTO items (item_name, price, preparation_time, image_url) VALUES ($1, $2, $3, $4) RETURNING *";

const getAll = "SELECT * FROM items";

const getList = "SELECT * FROM items WHERE item_id = ANY($1::int[])";

const getById = "SELECT * FROM items WHERE id = $1";

export default { setup, create, getAll, getList, getById };
