
const getAll = "SELECT * FROM items";

const getSelection = "SELECT * FROM items WHERE id = ANY($1::int[])";

const getById = "SELECT * FROM items WHERE id = $1";

export default { getAll, getSelection, getById };
