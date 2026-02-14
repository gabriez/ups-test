export interface OAuthUpsCredentials {
  // Token to be used in API requests.
  access_token: string;
  // Issue time of requested token.

  // Client id for requested token.
  client_id: string;
  // Expire time for requested token in seconds.
  expires_in: string;
  issued_at: string;
  // Number of refreshes for requested token.
  refresh_count: string;
  // Scope for requested token.
  scope: string;
  // Status for requested token.
  status: string;
  // Container for token response.
  token_type: string;
}

export interface UpsResponseErrors {
  response: {
    errors: { code: string; message: string }[];
  };
}

export function isUpsResponseError(res: unknown): res is UpsResponseErrors {
  return (
    typeof res === "object" &&
    res !== null &&
    "response" in res &&
    typeof res.response === "object" &&
    res.response !== null &&
    "errors" in res.response &&
    Array.isArray(res.response.errors)
  );
}
