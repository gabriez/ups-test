import { UpsAuth } from "#libs/UpsAuth.js";
import { HttpClient } from "#types/httpClient.js";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

describe("UpsAuth", () => {
  let httpClient: HttpClient;
  let upsAuth: UpsAuth;

  beforeEach(() => {
    httpClient = {
      post: vi.fn(),
    } as unknown as HttpClient;
    upsAuth = new UpsAuth("password", "username", "account", httpClient);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should fetch a new token if no token exists", async () => {
    const mockResponse = {
      data: { access_token: "new_token", expires_in: "3600", issued_at: "1000" },
      status: 200,
    };
    (httpClient.post as Mock).mockResolvedValue(mockResponse);

    const token = await upsAuth.getToken();

    expect(httpClient.post).toHaveBeenCalled();
    expect(token).toBe("new_token");
  });

  it("should return cached token if valid", async () => {
    const mockResponse = {
      data: { access_token: "cached_token", expires_in: "3600", issued_at: (Date.now() / 1000).toString() },
      status: 200,
    };
    (httpClient.post as Mock).mockResolvedValue(mockResponse);

    await upsAuth.getToken();

    (httpClient.post as Mock).mockClear();
    const token = await upsAuth.getToken();

    expect(httpClient.post).not.toHaveBeenCalled();
    expect(token).toBe("cached_token");
  });

  it("should fetch new token if expired", async () => {
    const startTime = 10000;
    // I set the time much later than the token expiration time just to ensure tests pass
    vi.setSystemTime(startTime * 1000);

    const validResponse = {
      data: { access_token: "valid_token", expires_in: "3600", issued_at: (startTime - 3000).toString() },
      status: 200,
    };

    (httpClient.post as Mock).mockResolvedValueOnce(validResponse);

    const token1 = await upsAuth.getToken();
    expect(token1).toBe("valid_token");
    expect(httpClient.post).toHaveBeenCalledTimes(1);

    vi.setSystemTime((startTime + 600) * 1000);

    const refreshedResponse = {
      data: { access_token: "refreshed_token", expires_in: "3600", issued_at: (startTime + 600).toString() },
      status: 200,
    };
    (httpClient.post as Mock).mockResolvedValueOnce(refreshedResponse);

    // Fetch second token
    const token2 = await upsAuth.getToken();
    expect(token2).toBe("refreshed_token");
    expect(httpClient.post).toHaveBeenCalledTimes(2);
  });

  it("should return null on API error", async () => {
    (httpClient.post as Mock).mockResolvedValue({ data: {}, status: 400 });
    const token = await upsAuth.getToken();
    expect(token).toBeNull();
  });
});
