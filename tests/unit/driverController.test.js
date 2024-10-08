import HttpException from "../../utils/exceptions/HttpException.js";
import DriverController from "../../resources/driver/controller.js";
import { jest } from "@jest/globals";

describe("DriverController.changeStatus", () => {
  let driverController;
  let mockDriverService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the driver service
    mockDriverService = {
      changeStatus: jest.fn(),
    };

    // Creating an instance of DriverController with the mocked driver service
    driverController = new DriverController();
    driverController._driverService = mockDriverService;

    // Mocking request, response, and next function
    req = {
      user: "mockUserId",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  const testCases = [
    { method: "setUnavailableStatus", status: "unavailable" },
    { method: "setAvailableStatus", status: "available" },
    { method: "setDeliveringStatus", status: "delivering" },
  ];

  testCases.forEach(({ method, status }) => {
    describe(`DriverController.${method}`, () => {
      it(`should respond with 200 and the new status when status is set to ${status}`, async () => {
        // Arrange
        const mockNewStatus = { status };
        mockDriverService.changeStatus.mockResolvedValue(mockNewStatus);

        // Act
        await driverController[method](req, res, next);

        // Assert
        expect(mockDriverService.changeStatus).toHaveBeenCalledWith(
          status,
          "mockUserId",
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockNewStatus);
        expect(next).not.toHaveBeenCalled();
      });

      it(`should call next with HttpException when setting status to ${status} fails`, async () => {
        // Arrange
        const error = new Error(`Failed to change status to ${status}`);
        mockDriverService.changeStatus.mockRejectedValue(error);

        // Act
        await driverController[method](req, res, next);

        // Assert
        expect(mockDriverService.changeStatus).toHaveBeenCalledWith(
          status,
          "mockUserId",
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
          new HttpException(400, `Failed to change status to ${status}`),
        );
      });

      it(`should call next with HttpException with the error message if setting status to ${status} fails without a specific message`, async () => {
        // Arrange
        const error = new Error();
        mockDriverService.changeStatus.mockRejectedValue(error);

        // Act
        await driverController[method](req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(
          new HttpException(400, error.message),
        );
      });
    });
  });
});

describe("DriverController.becomeDriver", () => {
  let driverController;
  let mockDriverService;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Mocking the driver service
    mockDriverService = {
      registerDriver: jest.fn(),
    };

    // Creating an instance of DriverController with the mocked driver service
    driverController = new DriverController();
    driverController._driverService = mockDriverService;

    // Mocking request, response, and next function
    req = {
      user: "mockUserId",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should respond with 201 and the newly registered driver", async () => {
    // Arrange
    const mockDriver = { id: "driver1", name: "John Doe", status: "available" };
    mockDriverService.registerDriver.mockResolvedValue(mockDriver);

    // Act
    await driverController.becomeDriver(req, res, next);

    // Assert
    expect(mockDriverService.registerDriver).toHaveBeenCalledWith("mockUserId");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ driver: mockDriver });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with HttpException when driver registration fails", async () => {
    // Arrange
    const error = new Error("Failed to register driver");
    mockDriverService.registerDriver.mockRejectedValue(error);

    // Act
    await driverController.becomeDriver(req, res, next);

    // Assert
    expect(mockDriverService.registerDriver).toHaveBeenCalledWith("mockUserId");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      new HttpException(400, "Failed to register driver"),
    );
  });

  it("should call next with HttpException with the error message if available", async () => {
    // Arrange
    const error = new Error();
    mockDriverService.registerDriver.mockRejectedValue(error);

    // Act
    await driverController.becomeDriver(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpException(400, error.message));
  });
});
