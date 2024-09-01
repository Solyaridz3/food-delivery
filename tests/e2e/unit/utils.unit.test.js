import getRoadInfo from "../../../utils/location.js";
import { S3Client } from "@aws-sdk/client-s3";
import createS3Client from "./createS3Client.js"; // Adjust the import path as needed

jest.mock("@aws-sdk/client-s3"); // Mock the S3Client class

describe("Google maps get distance info tests", () => {
    it("should get distance", async () => {
        const {distanceKm, timeToDriveMinutes} = await getRoadInfo("Velyka Zhytomyrska St, 25/2, Kyiv, 02000");
        expect(distanceKm).toEqual(expect.any(Number));
        expect(timeToDriveMinutes).toEqual(expect.any(Number));
    });
});



describe("createS3Client", () => {
  const mockAccessKey = "mockAccessKey";
  const mockSecretAccessKey = "mockSecretAccessKey";
  const mockRegion = "mock-region";

  beforeEach(() => {
    // Mock environment variables
    process.env.S3_ACCESS_KEY = mockAccessKey;
    process.env.S3_SECRET_ACCESS_KEY = mockSecretAccessKey;
    process.env.BUCKET_LOCATION = mockRegion;

    // Clear previous mocks and spies
    jest.clearAllMocks();
  });

  it("should create an S3Client instance with the correct credentials and region", () => {
    // Call the function to create the S3 client
    createS3Client();

    // Check if S3Client was called with correct parameters
    expect(S3Client).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: mockAccessKey,
        secretAccessKey: mockSecretAccessKey,
      },
      region: mockRegion,
    });
  });

  it("should return an instance of S3Client", () => {
    // Mock S3Client instance
    const mockS3ClientInstance = {};
    S3Client.mockImplementation(() => mockS3ClientInstance);

    const s3Client = createS3Client();

    expect(s3Client).toBe(mockS3ClientInstance);
  });
});