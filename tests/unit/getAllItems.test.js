import HttpException from "../../utils/exceptions/HttpException.js";
import ItemController from "../../resources/item/controller.js";
import { jest } from "@jest/globals";

describe("ItemController.getAll", () => {
  let itemController;
  let mockItemService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the item service
    mockItemService = {
      getAll: jest.fn(),
    };

    // Creating an instance of ItemController with the mocked item service
    itemController = new ItemController();
    itemController._itemService = mockItemService; // Accessing private service

    // Mocking request, response, and next function
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the items when found", async () => {
    // Arrange
    const mockItems = [
      { id: "item1", name: "Pizza" },
      { id: "item2", name: "Burger" },
    ];
    mockItemService.getAll.mockResolvedValue(mockItems);

    // Act
    await itemController.getAll(req, res, next);

    // Assert
    expect(mockItemService.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: mockItems });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when an error occurs", async () => {
    // Arrange
    const error = new Error("Failed to fetch items");
    mockItemService.getAll.mockRejectedValue(error);

    // Act
    await itemController.getAll(req, res, next);

    // Assert
    expect(mockItemService.getAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to fetch items"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockItemService.getAll.mockRejectedValue(error);

    // Act
    await itemController.getAll(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
