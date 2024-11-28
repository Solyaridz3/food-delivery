import DriverService from "../../resources/driver/service.js";
import queries from "../../resources/driver/queries.js";
import pool from "../../db.js";
import { jest } from "@jest/globals";

describe("DriverService", () => {
  let mockPool;
  let mockQueries;
  let driverService;

  beforeEach(() => {
    // Mock the pool
    mockPool = {
      query: jest.fn(),
    };

    // Mock the queries
    mockQueries = {
      changeStatus:
        "UPDATE drivers SET status = $1 WHERE user_id = $2 RETURNING status",
      registerDriver: "INSERT into drivers (user_id) VALUES ($1) RETURNING *",
      getAvailableDrivers: "SELECT * FROM drivers WHERE status = 'available'",
      setUserDriverStatus:
        "UPDATE users SET user_role = 'driver' WHERE id = $1",
    };

    // Replace actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "changeStatus", mockQueries.changeStatus);
    jest.replaceProperty(queries, "registerDriver", mockQueries.registerDriver);
    jest.replaceProperty(
      queries,
      "getAvailableDrivers",
      mockQueries.getAvailableDrivers,
    );
    jest.replaceProperty(
      queries,
      "setUserDriverStatus",
      mockQueries.setUserDriverStatus,
    );

    // Initialize the service
    driverService = new DriverService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("changeStatus", () => {
    it("should change the status of a driver and return the new status", async () => {
      const newStatus = { status: "active" };
      mockPool.query.mockResolvedValue({ rows: [newStatus] });

      const result = await driverService.changeStatus("active", 1);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.changeStatus, [
        "active",
        1,
      ]);
      expect(result).toEqual(newStatus);
    });

    it("should throw an error if changing status fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(driverService.changeStatus("active", 1)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("registerDriver", () => {
    it("should register a new driver and return the registered driver", async () => {
      const mockDriver = { user_id: 1, status: "active" };
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // setUserDriverStatus query
        .mockResolvedValueOnce({ rows: [mockDriver] }); // registerDriver query

      const result = await driverService.registerDriver(1);

      expect(mockPool.query).toHaveBeenCalledWith(
        mockQueries.setUserDriverStatus,
        [1],
      );
      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.registerDriver, [
        1,
      ]);
      expect(result).toEqual(mockDriver);
    });

    it("should throw an error if registration fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(driverService.registerDriver(1)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getAvailableDrivers", () => {
    it("should return a list of available drivers", async () => {
      const availableDrivers = [
        { user_id: 1, status: "available" },
        { user_id: 2, status: "available" },
      ];
      mockPool.query.mockResolvedValue({ rows: availableDrivers });

      const result = await driverService.getAvailableDrivers();

      expect(mockPool.query).toHaveBeenCalledWith(
        mockQueries.getAvailableDrivers,
      );
      expect(result).toEqual(availableDrivers);
    });

    it("should return an empty list if there are no available drivers", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await driverService.getAvailableDrivers();

      expect(mockPool.query).toHaveBeenCalledWith(
        mockQueries.getAvailableDrivers,
      );
      expect(result).toEqual([]);
    });

    it("should throw an error if fetching available drivers fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(driverService.getAvailableDrivers()).rejects.toThrow(
        "Database error",
      );
    });
  });
});
