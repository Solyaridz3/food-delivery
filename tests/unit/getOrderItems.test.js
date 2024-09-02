import HttpException from "../../utils/exceptions/HttpException.js";
import OrderController from "../../resources/order/controller.js";
import { jest } from "@jest/globals";

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
