import ItemService from "../../resources/item/service.js";
import queries from "../../resources/item/queries.js";
import pool from "../../db.js";
import { jest } from "@jest/globals";

describe("ItemService", () => {
  let mockPool;
  let mockQueries;
  let itemService;

  beforeEach(() => {
    // Mock the pool
    mockPool = {
      query: jest.fn(),
    };

    // Mock the queries
    mockQueries = {
      getAll: "SELECT * FROM items",
      getSelection: "SELECT * FROM items WHERE id = ANY($1::int[])",
      getById: "SELECT * FROM items WHERE id = $1",
    };

    // Replace actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "getAll", mockQueries.getAll);
    jest.replaceProperty(queries, "getSelection", mockQueries.getSelection);
    jest.replaceProperty(queries, "getById", mockQueries.getById);

    // Initialize the service
    itemService = new ItemService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return a list of all items", async () => {
      const mockItems = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      mockPool.query.mockResolvedValue({ rows: mockItems });

      const result = await itemService.getAll();

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getAll);
      expect(result).toEqual(mockItems);
    });

    it("should return an empty list if there are no items", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await itemService.getAll();

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getAll);
      expect(result).toEqual([]);
    });

    it("should throw an error if fetching items fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(itemService.getAll()).rejects.toThrow("Database error");
    });
  });

  describe("getItem", () => {
    it("should return a single item by its ID", async () => {
      const mockItem = { id: 1, name: "Item 1" };
      mockPool.query.mockResolvedValue({ rows: [mockItem] });

      const result = await itemService.getItem(1);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getById, [1]);
      expect(result).toEqual(mockItem);
    });

    it("should return undefined if the item is not found", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const result = await itemService.getItem(1);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getById, [1]);
      expect(result).toBeUndefined();
    });

    it("should throw an error if fetching the item fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(itemService.getItem(1)).rejects.toThrow("Database error");
    });
  });

  describe("getSelection", () => {
    it("should return a list of items based on the provided item IDs", async () => {
      const mockItems = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      const itemIds = [1, 2];
      mockPool.query.mockResolvedValue({ rows: mockItems });

      const result = await itemService.getSelection(itemIds);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getSelection, [
        itemIds,
      ]);
      expect(result).toEqual(mockItems);
    });

    it("should return an empty list if none of the provided item IDs match", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });
      const itemIds = [3, 4];

      const result = await itemService.getSelection(itemIds);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getSelection, [
        itemIds,
      ]);
      expect(result).toEqual([]);
    });

    it("should throw an error if fetching the selection of items fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(itemService.getSelection([1, 2])).rejects.toThrow(
        "Database error",
      );
    });
  });
});
