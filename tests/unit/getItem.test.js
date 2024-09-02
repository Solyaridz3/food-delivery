import HttpException from "../../utils/exceptions/HttpException.js";
import ItemController from "../../resources/item/controller.js";
import { jest } from "@jest/globals";

describe("ItemController.getItem", () => {
  let itemController;
  let mockItemService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the item service
    mockItemService = {
      getItem: jest.fn(),
    };

    // Creating an instance of ItemController with the mocked item service
    itemController = new ItemController();
    itemController._itemService = mockItemService;

    // Mocking request, response, and next function
    req = {
      params: {
        itemId: "mockItemId",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the item when found", async () => {
    // Arrange
    const mockItem = { id: "mockItemId", name: "Pizza" };
    mockItemService.getItem.mockResolvedValue(mockItem);

    // Act
    await itemController.getItem(req, res, next);

    // Assert
    expect(mockItemService.getItem).toHaveBeenCalledWith("mockItemId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ item: mockItem });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when item is not found", async () => {
    // Arrange
    const error = new Error("Item not found");
    mockItemService.getItem.mockRejectedValue(error);

    // Act
    await itemController.getItem(req, res, next);

    // Assert
    expect(mockItemService.getItem).toHaveBeenCalledWith("mockItemId");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new HttpException(404, "Item not found"));
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockItemService.getItem.mockRejectedValue(error);

    // Act
    await itemController.getItem(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(404, error.message));
  });
});
