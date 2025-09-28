import ApiHttpClient from "./ApiHttpClient";
import ApiHttpClientAuthenticated from "./ApiHttpClientAuthenticated";
import SessionApi from "./session/SessionApi";
import SessionService from "@services/session/SessionService";

interface Api {
  apiHttpClient: ApiHttpClient;
  sessionApi: SessionApi;
}

export function createApplicationServices(): Api {
  const apiHttpClient = new ApiHttpClient();
  const sessionApi = new SessionApi(apiHttpClient);

  return {
    apiHttpClient,
    sessionApi,
  };
}
