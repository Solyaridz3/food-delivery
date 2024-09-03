import fetchMock from "jest-fetch-mock";
import getRoadInfo from "../../utils/location.js";
import { jest } from "@jest/globals";
import crypto from "crypto";
import auth from "../../utils/token.js";

const secret = process.env.JWT_SECRET;

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
    "Response status: 400",
  );
});

test("should throw error for invalid JSON response", async () => {
  const mockResponse = {
    ok: true,
    json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
  };

  fetchMock.mockResolvedValueOnce(mockResponse);

  await expect(getRoadInfo("My Destination")).rejects.toThrowError(
    "Invalid JSON",
  );
});

describe("Auth Functions", () => {
  test("base64UrlEncode encodes correctly", () => {
    const input = "test";
    const expected = "dGVzdA"; // base64UrlEncode('test') expected output
    expect(auth.base64UrlEncode(input)).toBe(expected);
  });

  test("createToken generates a valid token", () => {
    const user = { id: "123", user_role: "admin" };
    const token = auth.createToken(user);

    expect(token).toBeDefined();

    const parts = token.split(".");
    expect(parts.length).toBe(3); // should be header.payload.signature

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify header
    const decodedHeader = Buffer.from(encodedHeader, "base64").toString();
    expect(JSON.parse(decodedHeader)).toEqual({ alg: "HS256", typ: "JWT" });

    // Verify payload
    const decodedPayload = Buffer.from(encodedPayload, "base64").toString();
    const payload = JSON.parse(decodedPayload);
    expect(payload.id).toBe(user.id);
    expect(payload.role).toBe(user.user_role);

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    expect(signature).toBe(expectedSignature);
  });

  test("verifyToken throws error for invalid signature", () => {
    const invalidToken = "invalid.token.signature";
    expect(() => auth.verifyToken(invalidToken)).toThrow("Invalid signature");
  });

  test("verifyToken throws error for expired token", () => {
    // Generate a token with an expired expiry date
    const expiredToken = auth.createToken(
      { id: "123", user_role: "admin" },
      -3600,
    ); // 1 hour ago
    expect(() => auth.verifyToken(expiredToken)).toThrow("Token has expired");
  });

  test("verifyToken returns payload for valid token", () => {
    const user = { id: "123", user_role: "admin" };
    const token = auth.createToken(user);
    const payload = auth.verifyToken(token);
    expect(payload.id).toBe(user.id);
    expect(payload.role).toBe(user.user_role);
  });
});
