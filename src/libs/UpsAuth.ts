import type { OAuthUpsCredentials, UpsResponseErrors } from "#types/UpsTypes.js";

import { HttpClient } from "#types/httpClient.js";

export class UpsAuth {
  private credentials: null | OAuthUpsCredentials;
  private httpClient: HttpClient;
  private password: string;
  private upsAccountNumber: string;
  private username: string;

  constructor(password: string, username: string, upsAccountNumber: string, httpClient: HttpClient) {
    this.password = password;
    this.username = username;
    this.upsAccountNumber = upsAccountNumber;
    this.credentials = null;
    this.httpClient = httpClient;
  }

  public async getToken(): Promise<null | string> {
    if (!this.credentials || this.isTokenExpired()) {
      await this.fetchToken();
    }
    return this.credentials ? this.credentials.access_token : null;
  }

  private async fetchToken(): Promise<void> {
    try {
      const formData = {
        grant_type: "client_credentials",
      };
      const { data, status } = await this.httpClient.post<OAuthUpsCredentials | UpsResponseErrors>(
        `/security/v1/oauth/token`,
        new URLSearchParams(formData).toString(),
        {
          headers: {
            Authorization: "Basic " + btoa(`${this.username}:${this.password}`),
            "Content-Type": "application/x-www-form-urlencoded",
            "x-merchant-id": this.upsAccountNumber,
          },
        },
      );

      if (status === 200) {
        this.credentials = data as OAuthUpsCredentials;
      }
      if (status !== 200) {
        this.credentials = null;
        if (status === 400) {
          console.log("Bad request while fetching UPS token:", data);
        }
        if (status === 401) {
          console.log("Unauthorized while fetching UPS token:", data);
        }
        if (status === 403) {
          console.log("Forbidden while fetching UPS token:", data);
        }
        if (status === 429) {
          console.log("Too many requests while fetching UPS token:", data);
          // TODO: Consider implementing retry logic with exponential backoff to handle rate limits
        }
      }
    } catch (err) {
      console.log("Error fetching UPS token:", err);
    }
  }

  private isTokenExpired(): boolean {
    if (!this.credentials) return true;
    const issuedAt = parseInt(this.credentials.issued_at, 10);
    const expiresIn = parseInt(this.credentials.expires_in, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= issuedAt + expiresIn - 60; // Refresh token 1 minute before expiration
  }
}
