import AdminService from "../../resources/admin/service.js";
import queries from "../../resources/admin/queries.js";
import pool from "../../db.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../../utils/s3.js";
import crypto from "crypto";
import { jest } from "@jest/globals";

describe("AdminService", () => {
  let mockPool;
  let mockS3;
  let mockCrypto;
  let mockQueries;
  let adminService;

  beforeEach(() => {
    // Mock the pool
    mockPool = {
      query: jest.fn(),
    };

    // Mock the AWS S3 client
    mockS3 = {
      send: jest.fn(),
    };

    // Mock the crypto functions
    mockCrypto = {
      randomBytes: jest.fn(),
    };

    // Mock the queries
    mockQueries = {
      getAllOrders: "SELECT * FROM orders",
      updateOrderStatus:
        "UPDATE orders SET delivery_status = $1 WHERE id = $2 RETURNING *",
      deleteOrder: "DELETE from orders WHERE id = $1",
      getAllUsers: "SELECT id, name, email, phone, user_role FROM users",
      deleteUserRelatedDriver: "DELETE FROM drivers where user_id = $1",
      deleteUser: "DELETE FROM users WHERE id = $1",
      createItem:
        "INSERT INTO items (name, price, preparation_time, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      deleteItem: "DELETE from items WHERE id = $1",
      getAllDrivers: "SELECT * FROM drivers",
    };

    // Replace actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.spyOn(s3, "send").mockImplementation(mockS3.send);
    jest
      .spyOn(crypto, "randomBytes")
      .mockImplementation(mockCrypto.randomBytes);
    jest.replaceProperty(queries, "getAllOrders", mockQueries.getAllOrders);
    jest.replaceProperty(
      queries,
      "updateOrderStatus",
      mockQueries.updateOrderStatus,
    );
    jest.replaceProperty(queries, "deleteOrder", mockQueries.deleteOrder);
    jest.replaceProperty(queries, "getAllUsers", mockQueries.getAllUsers);
    jest.replaceProperty(
      queries,
      "deleteUserRelatedDriver",
      mockQueries.deleteUserRelatedDriver,
    );
    jest.replaceProperty(queries, "deleteUser", mockQueries.deleteUser);
    jest.replaceProperty(queries, "createItem", mockQueries.createItem);
    jest.replaceProperty(queries, "deleteItem", mockQueries.deleteItem);
    jest.replaceProperty(queries, "getAllDrivers", mockQueries.getAllDrivers);

    // Initialize the service
    adminService = new AdminService();
    adminService.s3 = mockS3;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Orders

  describe("getAllOrders", () => {
    it("should return a list of all orders", async () => {
      const mockOrders = [
        { id: 1, delivery_status: "delivered" },
        { id: 2, delivery_status: "pending" },
      ];
      mockPool.query.mockResolvedValue({ rows: mockOrders });

      const result = await adminService.getAllOrders();

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getAllOrders);
      expect(result).toEqual(mockOrders);
    });

    it("should throw an error if fetching orders fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.getAllOrders()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("should update the status of an order and return the updated order", async () => {
      const mockOrder = { id: 1, delivery_status: "delivered" };
      mockPool.query.mockResolvedValue({ rows: [mockOrder] });

      const result = await adminService.updateOrderStatus("delivered", 1);

      expect(mockPool.query).toHaveBeenCalledWith(
        mockQueries.updateOrderStatus,
        ["delivered", 1],
      );
      expect(result).toEqual(mockOrder);
    });

    it("should throw an error if updating the order status fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        adminService.updateOrderStatus("delivered", 1),
      ).rejects.toThrow("Database error");
    });
  });

  describe("deleteOrder", () => {
    it("should delete an order by its ID", async () => {
      mockPool.query.mockResolvedValue();

      await adminService.deleteOrder(1);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.deleteOrder, [1]);
    });

    it("should throw an error if deleting an order fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.deleteOrder(1)).rejects.toThrow(
        "Database error",
      );
    });
  });

  // Users

  describe("getAllUsers", () => {
    it("should return a list of all users", async () => {
      const mockUsers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ];
      mockPool.query.mockResolvedValue({ rows: mockUsers });

      const result = await adminService.getAllUsers();

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getAllUsers);
      expect(result).toEqual(mockUsers);
    });

    it("should throw an error if fetching users fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.getAllUsers()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and their related driver data by their ID", async () => {
      mockPool.query.mockResolvedValue();

      await adminService.deleteUser(1);

      expect(mockPool.query).toHaveBeenCalledWith(
        mockQueries.deleteUserRelatedDriver,
        [1],
      );
      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.deleteUser, [1]);
    });

    it("should throw an error if deleting a user fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.deleteUser(1)).rejects.toThrow(
        "Database error",
      );
    });
  });

  // Items

  describe("createItem", () => {
    it("should create a new item and return the item details", async () => {
      const mockItem = {
        id: 1,
        name: "Item 1",
        price: 100,
        preparation_time: 10,
        image_url: "http://example.com/image.png",
      };
      const mockImage = {
        buffer: Buffer.from("image data"),
        mimetype: "image/png",
      };
      const imageKey = "unique-image-key";

      mockCrypto.randomBytes.mockReturnValue(Buffer.from("unique-image-key"));
      mockS3.send.mockResolvedValue();
      jest
        .spyOn(adminService, "createImageUrl")
        .mockResolvedValue("http://example.com/image.png");
      mockPool.query.mockResolvedValue({ rows: [mockItem] });

      const result = await adminService.createItem(
        "Item 1",
        100,
        10,
        mockImage,
      );

      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32);
      expect(mockS3.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.createItem, [
        "Item 1",
        100,
        10,
        "http://example.com/image.png",
      ]);
      expect(result).toEqual([mockItem]);
    });

    it("should throw an error if creating an item fails", async () => {
      const mockImage = {
        buffer: Buffer.from("image data"),
        mimetype: "image/png",
      };

      mockCrypto.randomBytes.mockReturnValue(Buffer.from("unique-image-key"));
      mockS3.send.mockRejectedValue(new Error("S3 error"));

      await expect(
        adminService.createItem("Item 1", 100, 10, mockImage),
      ).rejects.toThrow("S3 error");
    });
  });

  describe("deleteItem", () => {
    it("should delete an item by its ID", async () => {
      mockPool.query.mockResolvedValue();

      await adminService.deleteItem(1);

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.deleteItem, [1]);
    });

    it("should throw an error if deleting an item fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.deleteItem(1)).rejects.toThrow(
        "Database error",
      );
    });
  });

  // Drivers

  describe("getAllDrivers", () => {
    it("should return a list of all drivers", async () => {
      const mockDrivers = [
        { id: 1, name: "Driver 1" },
        { id: 2, name: "Driver 2" },
      ];
      mockPool.query.mockResolvedValue({ rows: mockDrivers });

      const result = await adminService.getAllDrivers();

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getAllDrivers);
      expect(result).toEqual(mockDrivers);
    });

    it("should throw an error if fetching drivers fails", async () => {
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(adminService.getAllDrivers()).rejects.toThrow(
        "Database error",
      );
    });
  });
});
