import HttpException from "../../utils/exceptions/HttpException.js";
import AdminController from "../../resources/admin/controller.js";
import { jest } from "@jest/globals";

describe("AdminController.createItem", () => {
  let adminController;
  let mockAdminService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the admin service
    mockAdminService = {
      createItem: jest.fn(),
    };

    // Creating an instance of AdminController with the mocked admin service
    adminController = new AdminController();
    adminController._adminService = mockAdminService;

    // Mocking request, response, and next function
    req = {
      file: { filename: "image.png" }, // Mocking an uploaded file
      body: {
        name: "Pizza",
        price: 10.99,
        preparation_time: 15,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 201 and the created item when successful", async () => {
    // Arrange
    const mockItem = {
      id: "item1",
      name: "Pizza",
      price: 10.99,
      preparation_time: 15,
      image: req.file,
    };
    mockAdminService.createItem.mockResolvedValue(mockItem);

    // Act
    await adminController.createItem(req, res, next);

    // Assert
    expect(mockAdminService.createItem).toHaveBeenCalledWith(
      req.body.name,
      req.body.price,
      req.body.preparation_time,
      req.file,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ item: mockItem });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when creating the item fails", async () => {
    // Arrange
    const error = new Error("Failed to create item");
    mockAdminService.createItem.mockRejectedValue(error);

    // Act
    await adminController.createItem(req, res, next);

    // Assert
    expect(mockAdminService.createItem).toHaveBeenCalledWith(
      req.body.name,
      req.body.price,
      req.body.preparation_time,
      req.file,
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to create item"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockAdminService.createItem.mockRejectedValue(error);

    // Act
    await adminController.createItem(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
