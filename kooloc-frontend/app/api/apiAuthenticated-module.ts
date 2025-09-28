import ApiHttpClient from "./ApiHttpClient";
import ApiHttpClientAuthenticated from "./ApiHttpClientAuthenticated";
import SessionService from "@services/session/SessionService";

interface ApiAuthenticated {
  apiHttpClientAuthenticated: ApiHttpClientAuthenticated;
}

export function createApplicationServices(
  apiHttpClient: ApiHttpClient,
  sessionService: SessionService
): ApiAuthenticated {
  const apiHttpClientAuthenticated = new ApiHttpClientAuthenticated(
    apiHttpClient,
    sessionService
  );

  return {
    apiHttpClientAuthenticated,
  };
}
