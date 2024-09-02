// Import necessary libraries
import UserController from "../../resources/user/controller.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { jest } from "@jest/globals";

describe("UserController - register", () => {
  let userController;
  let mockUserService;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Mock the user service
    mockUserService = {
      register: jest.fn(),
    };

    userController = new UserController();
    userController._userService = mockUserService; // Inject mock user service

    // Mock request, response, and next objects
    mockReq = {
      body: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "password123",
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should register a user and return a token", async () => {
    const mockToken = "mockedToken";
    mockUserService.register.mockResolvedValueOnce(mockToken); // Mock successful registration

    await userController.register(mockReq, mockRes, mockNext);

    // Check if register method was called with correct arguments
    expect(mockUserService.register).toHaveBeenCalledWith(
      "John Doe",
      "johndoe@example.com",
      "1234567890",
      "password123",
      "user",
    );

    // Check if the response status and json methods were called with correct values
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ token: mockToken });
  });

  it("should call next with an HttpException when registration fails", async () => {
    const error = new Error("Registration failed");
    mockUserService.register.mockRejectedValueOnce(error); // Mock a failed registration

    await userController.register(mockReq, mockRes, mockNext);

    // Check if register method was called with correct arguments
    expect(mockUserService.register).toHaveBeenCalledWith(
      "John Doe",
      "johndoe@example.com",
      "1234567890",
      "password123",
      "user",
    );

    // Check if next is called with an HttpException
    expect(mockNext).toHaveBeenCalledWith(
      new HttpException(401, error.message),
    );
  });
});
