import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Storage } from "./storage";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("S3Storage", () => {
  const mockS3Client = {
    send: jest.fn(),
  };

  const bucketName = "test-bucket";
  const region = "us-east-1";
  let s3Storage: S3Storage;

  beforeEach(() => {
    (S3Client as jest.Mock).mockImplementation(() => mockS3Client);
    s3Storage = new S3Storage({ region, bucketName });
    jest.clearAllMocks();
  });

  describe("upload", () => {
    it("should upload a file to S3 and return the file URL", async () => {
      const buffer = Buffer.from("test data");
      const key = "test-file.jpg";
      const contentType = "image/jpeg";

      mockS3Client.send.mockResolvedValueOnce({});

      const result = await s3Storage.upload(buffer, key, contentType);

      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
      expect(result).toBe(`https://${bucketName}.s3.amazonaws.com/${key}`);
    });

    it("should throw an error if upload fails", async () => {
      const buffer = Buffer.from("test data");
      const key = "test-file.jpg";
      const errorMessage = "Failed to upload";

      mockS3Client.send.mockRejectedValueOnce(new Error(errorMessage));

      await expect(s3Storage.upload(buffer, key)).rejects.toThrow(errorMessage);
      expect(mockS3Client.send).toHaveBeenCalledWith(
        expect.any(PutObjectCommand)
      );
    });
  });

  describe("getObjectTemporaryLink", () => {
    it("should return a signed URL for the object", async () => {
      const key = "test-file.jpg";
      const signedUrl = "https://signed-url.com";

      (getSignedUrl as jest.Mock).mockResolvedValueOnce(signedUrl);

      const result = await s3Storage.getObjectTemporaryLink(key);

      expect(getSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 }
      );
      expect(result).toBe(signedUrl);
    });

    it("should throw an error if generating signed URL fails", async () => {
      const key = "test-file.jpg";
      const errorMessage = "Failed to generate signed URL";

      (getSignedUrl as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(s3Storage.getObjectTemporaryLink(key)).rejects.toThrow(
        errorMessage
      );
      expect(getSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 }
      );
    });
  });
});
