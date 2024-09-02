import OrderController from "../../resources/order/controller.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { jest } from "@jest/globals";

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
