import OrderService from "../../resources/order/service.js";
import pool from "../../db.js";
import queries from "../../resources/order/queries.js";
import { jest } from "@jest/globals";

describe("getOrderItems", () => {
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
      getOrderItems: "SELECT * FROM order_items WHERE order_id = $1",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "getOrderItems", mockQueries.getOrderItems);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of order items for the given order ID", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockOrderItems = [
      {
        id: 1,
        order_id: mockOrderId,
        item_id: 2,
        quantity: 3,
        item_price: 10.0,
      },
      {
        id: 2,
        order_id: mockOrderId,
        item_id: 3,
        quantity: 1,
        item_price: 15.0,
      },
    ];

    mockPool.query.mockResolvedValue({ rows: mockOrderItems });

    // Act
    const result = await orderService.getOrderItems(mockOrderId);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderItems, [
      mockOrderId,
    ]);
    expect(result).toEqual(mockOrderItems);
  });

  it("should return an empty array if the order has no items", async () => {
    // Arrange
    const mockOrderId = 1;

    mockPool.query.mockResolvedValue({ rows: [] });

    // Act
    const result = await orderService.getOrderItems(mockOrderId);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderItems, [
      mockOrderId,
    ]);
    expect(result).toEqual([]);
  });

  it("should throw an error if there is a database query failure", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockError = new Error("Database query failed");

    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(orderService.getOrderItems(mockOrderId)).rejects.toThrow(
      "Error fetching order items: Database query failed",
    );
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderItems, [
      mockOrderId,
    ]);
  });
});

describe("getUserOrders", () => {
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
      getUserOrders: "SELECT * FROM orders WHERE user_id = $1",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "getUserOrders", mockQueries.getUserOrders);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of orders for the given user ID", async () => {
    // Arrange
    const mockUserId = 1;
    const mockOrders = [
      { id: 1, user_id: mockUserId, total_price: 50.0, delivery_time: "22:24" },
      { id: 2, user_id: mockUserId, total_price: 30.0, delivery_time: "18:30" },
    ];

    mockPool.query.mockResolvedValue({ rows: mockOrders });

    // Act
    const result = await orderService.getUserOrders(mockUserId);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getUserOrders, [
      mockUserId,
    ]);
    expect(result).toEqual(mockOrders);
  });

  it("should return an empty array if the user has no orders", async () => {
    // Arrange
    const mockUserId = 1;

    mockPool.query.mockResolvedValue({ rows: [] });

    // Act
    const result = await orderService.getUserOrders(mockUserId);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getUserOrders, [
      mockUserId,
    ]);
    expect(result).toEqual([]);
  });

  it("should throw an error if there is a database query failure", async () => {
    // Arrange
    const mockUserId = 1;
    const mockError = new Error("Database query failed");

    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(orderService.getUserOrders(mockUserId)).rejects.toThrow(
      "Error fetching user orders: Database query failed",
    );
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getUserOrders, [
      mockUserId,
    ]);
  });
});

describe("getOrder", () => {
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
      getOrderById: "SELECT * FROM orders WHERE id = $1",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "getOrderById", mockQueries.getOrderById);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the order if it exists and belongs to the user", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockUserId = 2;
    const mockOrder = {
      id: mockOrderId,
      user_id: mockUserId,
      total_price: 50.0,
      delivery_time: "22:24",
    };

    mockPool.query.mockResolvedValue({ rows: [mockOrder] });

    // Act
    const result = await orderService.getOrder(mockOrderId, mockUserId);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderById, [
      mockOrderId,
    ]);
    expect(result).toEqual(mockOrder);
  });

  it("should throw an error if the order is not found", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockUserId = 2;

    mockPool.query.mockResolvedValue({ rows: [] });

    // Act & Assert
    await expect(
      orderService.getOrder(mockOrderId, mockUserId),
    ).rejects.toThrow("Order not found");
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderById, [
      mockOrderId,
    ]);
  });

  it("should throw an error if the order does not belong to the user", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockUserId = 2;
    const mockOrder = {
      id: mockOrderId,
      user_id: 3, // Different user ID
      total_price: 50.0,
      delivery_time: "22:24",
    };

    mockPool.query.mockResolvedValue({ rows: [mockOrder] });

    // Act & Assert
    await expect(
      orderService.getOrder(mockOrderId, mockUserId),
    ).rejects.toThrow("Forbidden. This is not your order.");
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderById, [
      mockOrderId,
    ]);
  });

  it("should throw an error if there is a database query failure", async () => {
    // Arrange
    const mockOrderId = 1;
    const mockUserId = 2;
    const mockError = new Error("Database query failed");

    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(
      orderService.getOrder(mockOrderId, mockUserId),
    ).rejects.toThrow("Error fetching order: Database query failed");
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getOrderById, [
      mockOrderId,
    ]);
  });
});

describe("calculateOrderTotals", () => {
  let orderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  it("should correctly calculate the total price and preparation time for given items", () => {
    // Arrange
    const mockItems = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
    ];
    const mockItemsData = [
      { id: 1, price: 10.0, preparation_time: 5 },
      { id: 2, price: 15.0, preparation_time: 7 },
    ];

    const expectedTotalPrice = 10.0 * 2 + 15.0 * 3; // 70.0
    const expectedTotalPreparationTime = 5 + 7; // 12

    // Act
    const result = orderService.calculateOrderTotals(mockItems, mockItemsData);

    // Assert
    expect(result.totalPrice).toBe(expectedTotalPrice);
    expect(result.totalPreparationTime).toBe(expectedTotalPreparationTime);
  });

  it("should handle the case where an item is not found in itemsData", () => {
    // Arrange
    const mockItems = [
      { id: 1, quantity: 2 },
      { id: 3, quantity: 1 },
    ];
    const mockItemsData = [
      { id: 1, price: 10.0, preparation_time: 5 },
      { id: 2, price: 15.0, preparation_time: 7 },
    ];

    const expectedTotalPrice = 10.0 * 2; // 20.0
    const expectedTotalPreparationTime = 5; // 5

    // Act
    const result = orderService.calculateOrderTotals(mockItems, mockItemsData);

    // Assert
    expect(result.totalPrice).toBe(expectedTotalPrice);
    expect(result.totalPreparationTime).toBe(expectedTotalPreparationTime);
  });

  it("should return 0 for total price and preparation time if items array is empty", () => {
    // Arrange
    const mockItems = [];
    const mockItemsData = [
      { id: 1, price: 10.0, preparation_time: 5 },
      { id: 2, price: 15.0, preparation_time: 7 },
    ];

    // Act
    const result = orderService.calculateOrderTotals(mockItems, mockItemsData);

    // Assert
    expect(result.totalPrice).toBe(0);
    expect(result.totalPreparationTime).toBe(0);
  });

  it("should return 0 for total price and preparation time if itemsData array is empty", () => {
    // Arrange
    const mockItems = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
    ];
    const mockItemsData = [];

    // Act
    const result = orderService.calculateOrderTotals(mockItems, mockItemsData);

    // Assert
    expect(result.totalPrice).toBe(0);
    expect(result.totalPreparationTime).toBe(0);
  });
});

describe("getItemsData", () => {
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
      getItemsData: "SELECT id, name, price FROM items WHERE id = ANY($1)",
    };

    // Replace the actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.replaceProperty(queries, "getItemsData", mockQueries.getItemsData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return items data for given item IDs", async () => {
    // Arrange
    const mockItemIds = [1, 2, 3];
    const mockItemsData = [
      { id: 1, name: "Item 1", price: 10.0 },
      { id: 2, name: "Item 2", price: 15.0 },
    ];

    // Mocking the pool.query result
    mockPool.query.mockResolvedValue({ rows: mockItemsData });

    // Act
    const result = await orderService.getItemsData(mockItemIds);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getItemsData, [
      mockItemIds,
    ]);
    expect(result).toEqual(mockItemsData);
  });

  it("should return an empty array if no items match the given IDs", async () => {
    // Arrange
    const mockItemIds = [4, 5, 6];

    // Mocking the pool.query result to return an empty array
    mockPool.query.mockResolvedValue({ rows: [] });

    // Act
    const result = await orderService.getItemsData(mockItemIds);

    // Assert
    expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getItemsData, [
      mockItemIds,
    ]);
    expect(result).toEqual([]);
  });

  it("should throw an error if the query fails", async () => {
    // Arrange
    const mockItemIds = [1, 2, 3];

    // Mocking the pool.query to reject with an error
    const mockError = new Error("Database query failed");
    mockPool.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(orderService.getItemsData(mockItemIds)).rejects.toThrow(
      "Database query failed",
    );
  });
});

describe("getAvailableDriver", () => {
  let mockDriverService;
  let orderService;

  beforeEach(() => {
    // Mock the DriverService
    mockDriverService = {
      getAvailableDrivers: jest.fn(),
    };

    // Create a new instance of OrderService with the mocked DriverService
    orderService = new OrderService();
    orderService._driverService = mockDriverService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the first available driver", async () => {
    // Arrange
    const mockDrivers = [{ id: 1 }, { id: 2 }];
    mockDriverService.getAvailableDrivers.mockResolvedValue(mockDrivers);

    // Act
    const result = await orderService.getAvailableDriver();

    // Assert
    expect(mockDriverService.getAvailableDrivers).toHaveBeenCalled();
    expect(result).toBe(mockDrivers[0]);
  });

  it("should throw an error if no drivers are available", async () => {
    // Arrange
    mockDriverService.getAvailableDrivers.mockResolvedValue([]);

    // Act & Assert
    await expect(orderService.getAvailableDriver()).rejects.toThrow(
      "No available drivers at the moment",
    );
    expect(mockDriverService.getAvailableDrivers).toHaveBeenCalled();
  });
});

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
