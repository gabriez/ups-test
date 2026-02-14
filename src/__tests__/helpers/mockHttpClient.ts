import type { HttpClient, ResponseHttp } from "#types/httpClient.js";

import { RateResponseAPI } from "#types/ShippingRate.js";
import { OAuthUpsCredentials, UpsResponseErrors } from "#types/UpsTypes.js";
// import { AxiosRequestConfig } from "axios";

export class mockHttpClient implements HttpClient {
  statusCodeReturn = 200;

  async post<T>(uri: string): Promise<ResponseHttp<T>> {
    // if (uri == "/api/rating/v2409/Rate") {
    // }

    if (uri == "/security/v1/oauth/token") {
      const res = await this.handleToken();
      return Promise.resolve({
        data: res as T,
        status: this.statusCodeReturn,
        statusText: this.statusCodeReturn === 200 ? "OK" : "Error",
      });
    }
    await this.handleRate();

    return Promise.resolve({
      data: {} as T,
      status: 200,
      statusText: "OK",
    });
  }

  private handleRate() {
    if (this.statusCodeReturn !== 200) {
      let errorResponse: UpsResponseErrors = {
        response: {
          errors: [
            {
              code: this.statusCodeReturn.toString(),
              message: `Error while fetching UPS token`,
            },
          ],
        },
      };

      if (this.statusCodeReturn === 400) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "400",
                message: "Bad request while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 401) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "401",
                message: "Unauthorized while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 403) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "403",
                message: "Forbidden while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 429) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "429",
                message: "Too many requests while fetching UPS token",
              },
            ],
          },
        };
      }

      return Promise.resolve(errorResponse);
    }

    const rateData: RateResponseAPI = {
      RateResponse: {
        RatedShipment: [],
      },
    };
    return Promise.resolve(rateData);
  }

  private handleToken() {
    if (this.statusCodeReturn !== 200) {
      let errorResponse: UpsResponseErrors = {
        response: {
          errors: [
            {
              code: this.statusCodeReturn.toString(),
              message: `Error  while fetching UPS token`,
            },
          ],
        },
      };

      if (this.statusCodeReturn === 400) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "400",
                message: "Bad request while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 401) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "401",
                message: "Unauthorized while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 403) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "403",
                message: "Forbidden while fetching UPS token",
              },
            ],
          },
        };
      }

      if (this.statusCodeReturn === 429) {
        errorResponse = {
          response: {
            errors: [
              {
                code: "429",
                message: "Too many requests while fetching UPS token",
              },
            ],
          },
        };
      }

      return Promise.resolve(errorResponse);
    }

    const tokenData: OAuthUpsCredentials = {
      access_token: "mocked_access_token",
      client_id: "mocked_client_id",
      expires_in: "3600",
      issued_at: new Date().toISOString(),
      refresh_count: "0",
      scope: "mocked_scope",
      status: "mocked_status",
      token_type: "Bearer",
    };
    return Promise.resolve(tokenData);
  }
}
