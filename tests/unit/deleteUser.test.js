import AdminController from "../../resources/admin/controller.js";
import HttpException from "../../utils/exceptions/HttpException.js";
import { jest } from "@jest/globals";

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
