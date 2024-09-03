import OrderService from "../../resources/order/service.js";
import pool from "../../db.js";
import queries from "../../resources/order/queries.js";
import { jest } from "@jest/globals";

describe("createOrder", () => {
  let mockPool;
  let mockQueries;
  let orderService;

  beforeEach(() => {
    // Mock the queries and pool
    mockPool = {
      query: jest.fn(),
    };

    orderService = new OrderService();

    mockQueries = {
      create:
        "INSERT INTO orders (user_id, driver_id, total_price, delivery_time) VALUES ($1, $2, $3, $4) RETURNING id",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "create", mockQueries.create);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an order and return the order ID", async () => {
    // Arrange
    const mockUserId = 1;
    const mockDriverId = 2;
    const mockTotalPrice = 50.0;
    const mockDeliveryTime = "22.24";
    const mockOrderId = 123;

    // Mocking the pool.query result
    mockPool.query.mockResolvedValue({
      rows: [{ id: mockOrderId }],
    });

    // Act
    const result = await orderService.createOrder(
      mockUserId,
      mockDriverId,
      mockTotalPrice,
      mockDeliveryTime,
    );

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.create, [
      mockUserId,
      mockDriverId,
      mockTotalPrice,
      mockDeliveryTime,
    ]);
    expect(result).toBe(mockOrderId);
  });

  it("should throw an error if the query fails", async () => {
    // Arrange
    const mockUserId = 1;
    const mockDriverId = 2;
    const mockTotalPrice = 50.0;
    const mockDeliveryTime = "22.24";

    // Mocking the pool.query to reject with an error
    const mockError = new Error("Database query failed");
    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(
      orderService.createOrder(
        mockUserId,
        mockDriverId,
        mockTotalPrice,
        mockDeliveryTime,
      ),
    ).rejects.toThrow("Database query failed");
  });
});

describe("insertOrderItems", () => {
  let mockPool;
  let mockQueries;
  let orderService;

  beforeEach(() => {
    // Mock the queries and pool
    mockPool = {
      query: jest.fn(),
    };

    orderService = new OrderService();

    mockQueries = {
      insertOrderItems:
        "INSERT INTO order_items (order_id, item_id, quantity, item_price) VALUES ($1, $2, $3, $4)",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(
      queries,
      "insertOrderItems",
      mockQueries.insertOrderItems,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert order items into the database", async () => {
    // Arrange
    const mockOrderId = 123;
    const mockItems = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
    ];
    const mockItemsData = [
      { id: 1, price: 10.0 },
      { id: 2, price: 15.0 },
    ];

    // Mocking the pool.query result
    mockPool.query.mockResolvedValue({});

    // Act
    await orderService.insertOrderItems(mockOrderId, mockItems, mockItemsData);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.insertOrderItems, [
      mockOrderId,
      1,
      2,
      10.0,
    ]);
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.insertOrderItems, [
      mockOrderId,
      2,
      3,
      15.0,
    ]);
    expect(mockPool.query).toHaveBeenCalledTimes(2);
  });

  it("should throw an error if the query fails", async () => {
    // Arrange
    const mockOrderId = 123;
    const mockItems = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
    ];
    const mockItemsData = [
      { id: 1, price: 10.0 },
      { id: 2, price: 15.0 },
    ];

    // Mocking the pool.query to reject with an error
    const mockError = new Error("Database query failed");
    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(
      orderService.insertOrderItems(mockOrderId, mockItems, mockItemsData),
    ).rejects.toThrow("Database query failed");
  });
});
