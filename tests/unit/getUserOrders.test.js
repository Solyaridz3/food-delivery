import HttpException from "../../utils/exceptions/HttpException.js";
import OrderController from "../../resources/order/controller.js";
import { jest } from "@jest/globals";

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
