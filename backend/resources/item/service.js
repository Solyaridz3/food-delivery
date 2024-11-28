import pool from "../../db.js";
import queries from "./queries.js";

class ItemService {
  /**
   * Retrieves a list of all items from the database.
   * @returns {Promise<Object[]>} A promise that resolves to an array of item objects.
   */
  getAll = async () => {
    const data = await pool.query(queries.getAll); // Executes the query to get all items
    const items = data.rows; // Extracts the rows from the query result
    return items; // Returns the list of items
  };

  /**
   * Retrieves details of a specific item by its ID.
   * @param {number} itemId - The ID of the item to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the item object.
   */
  getItem = async (itemId) => {
    const data = await pool.query(queries.getById, [itemId]); // Executes the query with itemId as a parameter
    const item = data.rows[0]; // Extracts the first row from the query result (expected single item)
    return item; // Returns the item details
  };

  /**
   * Retrieves a selection of items based on provided IDs.
   * @param {number[]} itemsIds - An array of item IDs to retrieve.
   * @returns {Promise<Object[]>} A promise that resolves to an array of item objects.
   */
  getSelection = async (itemsIds) => {
    const queryResult = await pool.query(queries.getSelection, [itemsIds]); // Executes the query with itemsIds as a parameter
    const items = queryResult.rows; // Extracts the rows from the query result
    return items; // Returns the list of selected items
  };
}

export default ItemService;
