import HttpException from "../../utils/exceptions/HttpException.js";
import AdminController from "../../resources/admin/controller.js";
import { jest } from "@jest/globals";

describe("AdminController.getAllOrders", () => {
  let adminController;
  let mockAdminService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the admin service
    mockAdminService = {
      getAllOrders: jest.fn(),
    };

    // Creating an instance of AdminController with the mocked admin service
    adminController = new AdminController();
    adminController._adminService = mockAdminService;

    // Mocking request, response, and next function
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the list of orders when successful", async () => {
    // Arrange
    const mockOrders = [
      { id: "order1", item: "Pizza", quantity: 2 },
      { id: "order2", item: "Burger", quantity: 1 },
    ];
    mockAdminService.getAllOrders.mockResolvedValue(mockOrders);

    // Act
    await adminController.getAllOrders(req, res, next);

    // Assert
    expect(mockAdminService.getAllOrders).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ orders: mockOrders });
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw a HttpException with 403 when getting orders fails", async () => {
    // Arrange
    const error = new Error("Failed to get orders");
    mockAdminService.getAllOrders.mockRejectedValue(error);

    // Act & Assert
    await expect(adminController.getAllOrders(req, res, next)).rejects.toThrow(
      new HttpException(403, "Failed to get orders"),
    );
    expect(mockAdminService.getAllOrders).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw a HttpException with 403 and error message if available", async () => {
    // Arrange
    const error = new Error();
    mockAdminService.getAllOrders.mockRejectedValue(error);

    // Act & Assert
    await expect(adminController.getAllOrders(req, res, next)).rejects.toThrow(
      new HttpException(403, error.message),
    );
    expect(mockAdminService.getAllOrders).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
