import HttpException from "../../utils/exceptions/HttpException.js";
import OrderController from "../../resources/order/controller.js";
import { jest } from "@jest/globals";

describe("OrderController.getOrder", () => {
  let orderController;
  let mockOrderService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the order service
    mockOrderService = {
      getOrder: jest.fn(),
    };

    // Creating an instance of OrderController with the mocked order service
    orderController = new OrderController();
    orderController._orderService = mockOrderService;

    // Mocking request, response, and next function
    req = {
      user: "mockUserId",
      params: {
        orderId: "mockOrderId",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the order when found", async () => {
    // Arrange
    const mockOrder = { id: "mockOrderId", userId: "mockUserId" };
    mockOrderService.getOrder.mockResolvedValue(mockOrder);

    // Act
    await orderController.getOrder(req, res, next);

    // Assert
    expect(mockOrderService.getOrder).toHaveBeenCalledWith(
      "mockOrderId",
      "mockUserId",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order: { ...mockOrder } });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when order is not found", async () => {
    // Arrange
    const error = new Error("Order not found");
    mockOrderService.getOrder.mockRejectedValue(error);

    // Act
    await orderController.getOrder(req, res, next);

    // Assert
    expect(mockOrderService.getOrder).toHaveBeenCalledWith(
      "mockOrderId",
      "mockUserId",
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "Order not found"),
    );
  });

  it("should call next with HttpException with a default message if error has no message", async () => {
    // Arrange
    const error = new Error();
    mockOrderService.getOrder.mockRejectedValue(error);

    // Act
    await orderController.getOrder(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "Order not found"),
    );
  });
});

describe("OrderController.getOrderItems", () => {
  let orderController;
  let mockOrderService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the order service
    mockOrderService = {
      getOrderItems: jest.fn(),
    };

    // Creating an instance of OrderController with the mocked order service
    orderController = new OrderController();
    orderController._orderService = mockOrderService;

    // Mocking request, response, and next function
    req = {
      params: {
        orderId: "mockOrderId",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the order items when found", async () => {
    // Arrange
    const mockItems = [
      { id: "item1", name: "Pizza", quantity: 2 },
      { id: "item2", name: "Burger", quantity: 1 },
    ];
    mockOrderService.getOrderItems.mockResolvedValue(mockItems);

    // Act
    await orderController.getOrderItems(req, res, next);

    // Assert
    expect(mockOrderService.getOrderItems).toHaveBeenCalledWith("mockOrderId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: mockItems });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when order items are not found", async () => {
    // Arrange
    const error = new Error("Order items not found");
    mockOrderService.getOrderItems.mockRejectedValue(error);

    // Act
    await orderController.getOrderItems(req, res, next);

    // Assert
    expect(mockOrderService.getOrderItems).toHaveBeenCalledWith("mockOrderId");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "Order items not found"),
    );
  });

  it("should call next with HttpException with a default message if error has no message", async () => {
    // Arrange
    const error = new Error();
    mockOrderService.getOrderItems.mockRejectedValue(error);

    // Act
    await orderController.getOrderItems(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "Order items not found"),
    );
  });
});

describe("OrderController.getUserOrders", () => {
  let orderController;
  let mockOrderService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the order service
    mockOrderService = {
      getUserOrders: jest.fn(),
    };

    // Creating an instance of OrderController with the mocked order service
    orderController = new OrderController();
    orderController._orderService = mockOrderService;

    // Mocking request, response, and next function
    req = {
      user: "mockUserId",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the user orders when found", async () => {
    // Arrange
    const mockUserOrders = [
      { id: "order1", userId: "mockUserId" },
      { id: "order2", userId: "mockUserId" },
    ];
    mockOrderService.getUserOrders.mockResolvedValue(mockUserOrders);

    // Act
    await orderController.getUserOrders(req, res, next);

    // Assert
    expect(mockOrderService.getUserOrders).toHaveBeenCalledWith("mockUserId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user_orders: mockUserOrders });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when user orders are not found", async () => {
    // Arrange
    const error = new Error("User orders not found");
    mockOrderService.getUserOrders.mockRejectedValue(error);

    // Act
    await orderController.getUserOrders(req, res, next);

    // Assert
    expect(mockOrderService.getUserOrders).toHaveBeenCalledWith("mockUserId");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "User orders not found"),
    );
  });

  it("should call next with HttpException with a default message if error has no message", async () => {
    // Arrange
    const error = new Error();
    mockOrderService.getUserOrders.mockRejectedValue(error);

    // Act
    await orderController.getUserOrders(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "User orders not found"),
    );
  });
});

describe("OrderController.makeOrder", () => {
  let orderController;
  let mockOrderService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the order service
    mockOrderService = {
      create: jest.fn(),
    };

    // Creating an instance of OrderController with the mocked order service
    orderController = new OrderController();
    orderController._orderService = mockOrderService;

    // Mocking request, response, and next function
    req = {
      user: "mockUserId",
      body: {
        items: [{ id: "item1", quantity: 2 }],
        address: "123 Main St",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 201 and the order ID when order is successfully created", async () => {
    // Arrange
    const mockOrderId = "mockOrderId";
    mockOrderService.create.mockResolvedValue(mockOrderId);

    // Act
    await orderController.makeOrder(req, res, next);

    // Assert
    expect(mockOrderService.create).toHaveBeenCalledWith(
      "mockUserId",
      req.body.items,
      req.body.address,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ order_id: mockOrderId });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when order creation fails", async () => {
    // Arrange
    const error = new Error("Failed to create order");
    mockOrderService.create.mockRejectedValue(error);

    // Act
    await orderController.makeOrder(req, res, next);

    // Assert
    expect(mockOrderService.create).toHaveBeenCalledWith(
      "mockUserId",
      req.body.items,
      req.body.address,
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to create order"),
    );
  });

  it("should call next with HttpException with a default message if error has no message", async () => {
    // Arrange
    const error = new Error();
    mockOrderService.create.mockRejectedValue(error);

    // Act
    await orderController.makeOrder(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to create order"),
    );
  });
});
