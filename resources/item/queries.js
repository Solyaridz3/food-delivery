const create =
    "INSERT INTO items (item_name, price, preparation_time, image_url) VALUES ($1, $2, $3, $4) RETURNING *";

const getAll = "SELECT * FROM items";

const getList = "SELECT * FROM items WHERE item_id = ANY($1::int[])";

const getById = "SELECT * FROM items WHERE id = $1";

export default { create, getAll, getList, getById };
