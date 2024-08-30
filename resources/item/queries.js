
const getAll = "SELECT * FROM items";

const getList = "SELECT * FROM items WHERE item_id = ANY($1::int[])";

const getById = "SELECT * FROM items WHERE id = $1";

export default { getAll, getList, getById };
