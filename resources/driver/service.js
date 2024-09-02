import pool from "../../db.js";
import queries from "./queries.js";

class DriverService {
  changeStatus = async (status, userId) => {
    const queryResult = await pool.query(queries.changeStatus, [
      status,
      userId,
    ]);
    const newStatus = queryResult.rows[0];
    return newStatus;
  };

  registerDriver = async (userId) => {
    await pool.query(queries.setUserDriverStatus, [userId]);
    const queryResult = await pool.query(queries.registerDriver, [userId]);
    return queryResult.rows[0];
  };

  getAvailableDrivers = async () => {
    const queryResult = await pool.query(queries.getAvailableDrivers);
    const availableDrivers = queryResult.rows;
    return availableDrivers;
  };
}

export default DriverService;
