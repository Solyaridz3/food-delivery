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
    expect(res.json).toHaveBeenCalledWith(mockOrder);
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
