import UserService from "../../resources/user/service.js";
import queries from "../../resources/user/queries.js";
import pool from "../../db.js";
import token from "../../utils/token.js";
import bcrypt from "bcryptjs";
import { jest } from "@jest/globals";

describe("UserService", () => {
  let mockPool;
  let mockBcrypt;
  let mockToken;
  let mockQueries;
  let userService;

  beforeEach(() => {
    // Mock the pool
    mockPool = {
      query: jest.fn(),
    };

    // Mock bcrypt functions
    mockBcrypt = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    // Mock token functions
    mockToken = {
      createToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    // Mock the queries
    mockQueries = {
      register:
        "INSERT INTO users (name, email, phone, password, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      getByEmail: "SELECT * FROM users WHERE email = $1",
      getById: "SELECT * FROM users WHERE id = $1",
      updateUser:
        "UPDATE users SET name = $2, email = $3, phone = $4, password = $5 WHERE id = $1 RETURNING *",
    };

    // Replace actual modules with the mocks
    jest.spyOn(pool, "query").mockImplementation(mockPool.query);
    jest.spyOn(bcrypt, "hash").mockImplementation(mockBcrypt.hash);
    jest.spyOn(bcrypt, "compare").mockImplementation(mockBcrypt.compare);
    jest.spyOn(token, "createToken").mockImplementation(mockToken.createToken);
    jest.spyOn(token, "verifyToken").mockImplementation(mockToken.verifyToken);
    jest.replaceProperty(queries, "register", mockQueries.register);
    jest.replaceProperty(queries, "getByEmail", mockQueries.getByEmail);
    jest.replaceProperty(queries, "getById", mockQueries.getById);
    jest.replaceProperty(queries, "updateUser", mockQueries.updateUser);

    // Initialize the service
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and return an access token", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        user_role: "user",
      };
      const hashedPassword = "hashedPassword";
      const accessToken = "mockAccessToken";

      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockPool.query.mockResolvedValue({ rows: [mockUser] });
      mockToken.createToken.mockReturnValue(accessToken);

      const result = await userService.register(
        "John Doe",
        "john@example.com",
        "123456789",
        "password",
        "user",
      );

      expect(mockBcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.register, [
        "John Doe",
        "john@example.com",
        "123456789",
        hashedPassword,
        "user",
      ]);
      expect(mockToken.createToken).toHaveBeenCalledWith({
        id: 1,
        user_role: "admin",
      });
      expect(result).toBe(accessToken);
    });

    it("should throw an error if registration fails", async () => {
      mockBcrypt.hash.mockResolvedValue("hashedPassword");
      mockPool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        userService.register(
          "John Doe",
          "john@example.com",
          "123456789",
          "password",
          "user",
        ),
      ).rejects.toThrow("Database error");
    });
  });

  // Tests for the login method
  describe("login", () => {
    it("should log in a user and return an access token", async () => {
      const mockUser = {
        id: 1,
        email: "john@example.com",
        password: "hashedPassword",
      };
      const accessToken = "mockAccessToken";

      mockPool.query.mockResolvedValue({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValue(true);
      mockToken.createToken.mockReturnValue(accessToken);

      const result = await userService.login("john@example.com", "password");

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getByEmail, [
        "john@example.com",
      ]);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password",
        "hashedPassword",
      );
      expect(mockToken.createToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(accessToken);
    });

    it("should throw an error if user is not found", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      await expect(
        userService.login("john@example.com", "password"),
      ).rejects.toThrow("User not found");
    });

    it("should throw an error if the password is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "john@example.com",
        password: "hashedPassword",
      };

      mockPool.query.mockResolvedValue({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.login("john@example.com", "password"),
      ).rejects.toThrow("Invalid password");
    });
  });

  // Tests for the update method
  describe("update", () => {
    it("should update user details and return the updated user data", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        password: "hashedPassword",
      };
      const updatedUser = {
        ...mockUser,
        name: "Jane Doe",
        email: "jane@example.com",
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] }); // getById query
      mockBcrypt.compare.mockResolvedValue(true); // password comparison
      mockPool.query.mockResolvedValueOnce({ rows: [updatedUser] }); // updateUser query

      const result = await userService.update({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password",
      });

      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.getById, [1]);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password",
        "hashedPassword",
      );
      expect(mockPool.query).toHaveBeenCalledWith(mockQueries.updateUser, [
        1,
        "Jane Doe",
        "jane@example.com",
        "123456789",
        "hashedPassword",
      ]);
      expect(result).toEqual({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "123456789",
      });
    });

    it("should throw an error if the user is not found", async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      await expect(
        userService.update({ id: 1, password: "password" }),
      ).rejects.toThrow("Error occurred: Unable to find your profile");
    });

    it("should throw an error if the current password is invalid", async () => {
      const mockUser = { id: 1, password: "hashedPassword" };

      mockPool.query.mockResolvedValue({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.update({ id: 1, password: "wrongPassword" }),
      ).rejects.toThrow("You entered an invalid password");
    });

    it("should throw an error if no fields are provided for update", async () => {
      const mockUser = { id: 1, password: "hashedPassword" };

      mockPool.query.mockResolvedValue({ rows: [mockUser] });
      mockBcrypt.compare.mockResolvedValue(true);

      await expect(
        userService.update({ id: 1, password: "password" }),
      ).rejects.toThrow("No fields provided for update.");
    });
  });
});
