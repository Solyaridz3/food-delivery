import HttpException from "../../utils/exceptions/HttpException.js";
import { jest } from "@jest/globals";

const userController = {
  login: jest.fn(), // Mock the userService
  deleteUser: jest.fn(),
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userController.login(email, password);
    return res.status(200).json({ token });
  } catch (err) {
    next(new HttpException(401, err.message));
  }
};

describe("login function", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should return 200 with a token if login is successful", async () => {
    const mockToken = "fakeToken123";
    userController.login.mockResolvedValue(mockToken); // Mock login success

    await login(req, res, next);

    expect(userController.login).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: mockToken });
  });

  test("should call next with HttpException if login fails", async () => {
    const mockError = new Error("Invalid credentials");
    userController.login.mockRejectedValue(mockError); // Mock login failure

    await login(req, res, next);

    expect(userController.login).toHaveBeenCalledWith(
      req.body.email,
      req.body.password,
    );
    expect(next).toHaveBeenCalledWith(
      new HttpException(401, mockError.message),
    );
  });
});
