import pool from "../../db.js";
import queries from "./queries.js";

class DriverService {
  /**
   * Updates the status of a driver.
   * @param {string} status - The new status to set for the driver (e.g., 'available', 'unavailable').
   * @param {number} userId - The ID of the user whose status is being updated.
   * @returns {Promise<Object>} A promise that resolves to the updated status object.
   */
  changeStatus = async (status, userId) => {
    const queryResult = await pool.query(queries.changeStatus, [
      status,
      userId,
    ]); // Executes the query to change the driver's status
    const newStatus = queryResult.rows[0]; // Extracts the updated status from the query result
    return newStatus; // Returns the updated status
  };

  /**
   * Registers a user as a driver.
   * @param {number} userId - The ID of the user to be registered as a driver.
   * @returns {Promise<Object>} A promise that resolves to the registered driver object.
   */
  registerDriver = async (userId) => {
    await pool.query(queries.setUserDriverStatus, [userId]); // Sets the user's status to driver in the database
    const queryResult = await pool.query(queries.registerDriver, [userId]); // Retrieves the registered driver details
    return queryResult.rows[0]; // Returns the registered driver object
  };

  /**
   * Retrieves a list of all available drivers.
   * @returns {Promise<Object[]>} A promise that resolves to an array of available driver objects.
   */
  getAvailableDrivers = async () => {
    const queryResult = await pool.query(queries.getAvailableDrivers); // Executes the query to get available drivers
    const availableDrivers = queryResult.rows; // Extracts the rows from the query result
    return availableDrivers; // Returns the list of available drivers
  };
}

export default DriverService;
