import HttpException from "../../utils/exceptions/HttpException.js";
import AdminController from "../../resources/admin/controller.js";
import { jest } from "@jest/globals";

describe("AdminController.getAllUsers", () => {
  let adminController;
  let mockAdminService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the admin service
    mockAdminService = {
      getAllUsers: jest.fn(),
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

  it("should respond with 200 and the list of users when successful", async () => {
    // Arrange
    const mockUsers = [
      { id: "user1", name: "Alice" },
      { id: "user2", name: "Bob" },
    ];
    mockAdminService.getAllUsers.mockResolvedValue(mockUsers);

    // Act
    await adminController.getAllUsers(req, res, next);

    // Assert
    expect(mockAdminService.getAllUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when getting users fails", async () => {
    // Arrange
    const error = new Error("Failed to get users");
    mockAdminService.getAllUsers.mockRejectedValue(error);

    // Act
    await adminController.getAllUsers(req, res, next);

    // Assert
    expect(mockAdminService.getAllUsers).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to get users"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockAdminService.getAllUsers.mockRejectedValue(error);

    // Act
    await adminController.getAllUsers(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
