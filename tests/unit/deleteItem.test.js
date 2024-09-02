import HttpException from "../../utils/exceptions/HttpException.js";
import AdminController from "../../resources/admin/controller.js";
import { jest } from "@jest/globals";

describe("AdminController.deleteItem", () => {
  let adminController;
  let mockAdminService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the admin service
    mockAdminService = {
      deleteItem: jest.fn(),
    };

    // Creating an instance of AdminController with the mocked admin service
    adminController = new AdminController();
    adminController._adminService = mockAdminService;

    // Mocking request, response, and next function
    req = {
      params: {
        itemId: "item1",
      },
    };

    res = {
      sendStatus: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 204 when item deletion is successful", async () => {
    // Act
    await adminController.deleteItem(req, res, next);

    // Assert
    expect(mockAdminService.deleteItem).toHaveBeenCalledWith(req.params.itemId);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when item deletion fails", async () => {
    // Arrange
    const error = new Error("Failed to delete item");
    mockAdminService.deleteItem.mockRejectedValue(error);

    // Act
    await adminController.deleteItem(req, res, next);

    // Assert
    expect(mockAdminService.deleteItem).toHaveBeenCalledWith(req.params.itemId);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(404, "Failed to delete item"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockAdminService.deleteItem.mockRejectedValue(error);

    // Act
    await adminController.deleteItem(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(404, error.message));
  });
});
