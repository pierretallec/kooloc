import ApiHttpClient from "../ApiHttpClient";

import type {
  RefreshableJwtToken,
  SessionCredentials,
} from "@services/session/SessionsTypes";

interface SessionRefresher {
  refresh(webSessionToken: string): Promise<RefreshableJwtToken>;
}

export default class SessionApi implements SessionRefresher {
  constructor(private readonly httpClient: ApiHttpClient) {}

  authenticate(credentials: SessionCredentials): Promise<RefreshableJwtToken> {
    return this.httpClient.restRequest<RefreshableJwtToken>(
      "POST",
      "/session",
      credentials
    );
  }

  register(credentials: SessionCredentials): Promise<RefreshableJwtToken> {
    return this.httpClient.restRequest<RefreshableJwtToken>(
      "POST",
      "/session/register",
      credentials
    );
  }

  refresh(webSessionToken: string): Promise<RefreshableJwtToken> {
    return this.httpClient.restRequest<RefreshableJwtToken>(
      "PUT",
      "/session",
      webSessionToken
    );
  }
}
