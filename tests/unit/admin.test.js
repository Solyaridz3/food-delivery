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

describe("AdminController - deleteUser", () => {
  let adminController;
  let mockAdminService;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockAdminService = {
      deleteUser: jest.fn(),
    };

    adminController = new AdminController();
    adminController._adminService = mockAdminService;

    mockReq = {
      params: {
        userId: "12345",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should delete user and return a success message", async () => {
    mockAdminService.deleteUser.mockResolvedValueOnce();

    await adminController.deleteUser(mockReq, mockRes, mockNext);

    expect(mockAdminService.deleteUser).toHaveBeenCalledWith("12345");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User with ID 12345 has been deleted successfully.",
    });
  });

  it("should call next with an HttpException when deleteUser throws an error", async () => {
    const error = new Error("User not found");
    mockAdminService.deleteUser.mockRejectedValueOnce(error);

    await adminController.deleteUser(mockReq, mockRes, mockNext);

    expect(mockAdminService.deleteUser).toHaveBeenCalledWith("12345");
    expect(mockNext).toHaveBeenCalledWith(
      new HttpException(404, error.message),
    );
  });
});
