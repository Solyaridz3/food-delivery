import HttpException from "../../utils/exceptions/HttpException.js";
import ItemController from "../../resources/item/controller.js";
import { jest } from "@jest/globals";

describe("ItemController.getSelection", () => {
  let itemController;
  let mockItemService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the item service
    mockItemService = {
      getSelection: jest.fn(),
    };

    // Creating an instance of ItemController with the mocked item service
    itemController = new ItemController();
    itemController._itemService = mockItemService;

    // Mocking request, response, and next function
    req = {
      body: {
        items_ids: ["item1", "item2"],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 200 and the selected items when found", async () => {
    // Arrange
    const mockItems = [
      { id: "item1", name: "Pizza" },
      { id: "item2", name: "Burger" },
    ];
    mockItemService.getSelection.mockResolvedValue(mockItems);

    // Act
    await itemController.getSelection(req, res, next);

    // Assert
    expect(mockItemService.getSelection).toHaveBeenCalledWith([
      "item1",
      "item2",
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: mockItems });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when fetching selected items fails", async () => {
    // Arrange
    const error = new Error("Failed to fetch selected items");
    mockItemService.getSelection.mockRejectedValue(error);

    // Act
    await itemController.getSelection(req, res, next);

    // Assert
    expect(mockItemService.getSelection).toHaveBeenCalledWith([
      "item1",
      "item2",
    ]);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to fetch selected items"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockItemService.getSelection.mockRejectedValue(error);

    // Act
    await itemController.getSelection(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
