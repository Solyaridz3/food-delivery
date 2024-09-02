import fetchMock from "jest-fetch-mock";
import getRoadInfo from "../../../utils/location.js";
import { jest } from "@jest/globals";

beforeEach(() => {
    fetchMock.enableMocks();
});

afterEach(() => {
    fetchMock.disableMocks();
});

test("should return road data for successful response", async () => {
    const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
            status: "OK",
            rows: [
                {
                    elements: [
                        {
                            distance: { value: 10000 },
                            duration: { value: 3600 },
                        },
                    ],
                },
            ],
        }),
    };

    fetchMock.mockResolvedValueOnce(mockResponse);

    const roadInfo = await getRoadInfo("My Destination");

    expect(roadInfo).toEqual({ distanceKm: 10, timeToDriveMinutes: 60 });
});

test("should throw error for non-OK response", async () => {
    const mockResponse = {
        ok: false,
        status: 400,
    };

    fetchMock.mockResolvedValueOnce(mockResponse);

    await expect(getRoadInfo("My Destination")).rejects.toThrowError(
        "Response status: 400"
    );
});

test("should throw error for invalid JSON response", async () => {
    const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    };

    fetchMock.mockResolvedValueOnce(mockResponse);

    await expect(getRoadInfo("My Destination")).rejects.toThrowError(
        "Invalid JSON"
    );
});
