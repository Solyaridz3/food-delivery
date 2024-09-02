import HttpException from "../../utils/exceptions/HttpException.js";
import AdminController from "../../resources/admin/controller.js";
import { jest } from "@jest/globals";

describe("AdminController.getAllDrivers", () => {
  let adminController;
  let mockAdminService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the admin service
    mockAdminService = {
      getAllDrivers: jest.fn(),
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

  it("should respond with 200 and the list of drivers when successful", async () => {
    // Arrange
    const mockDrivers = [
      { id: "driver1", name: "John" },
      { id: "driver2", name: "Jane" },
    ];
    mockAdminService.getAllDrivers.mockResolvedValue(mockDrivers);

    // Act
    await adminController.getAllDrivers(req, res, next);

    // Assert
    expect(mockAdminService.getAllDrivers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ drivers: mockDrivers });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when getting drivers fails", async () => {
    // Arrange
    const error = new Error("Failed to get drivers");
    mockAdminService.getAllDrivers.mockRejectedValue(error);

    // Act
    await adminController.getAllDrivers(req, res, next);

    // Assert
    expect(mockAdminService.getAllDrivers).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to get drivers"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockAdminService.getAllDrivers.mockRejectedValue(error);

    // Act
    await adminController.getAllDrivers(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
