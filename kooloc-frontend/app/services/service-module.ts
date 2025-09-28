import SessionService from "./session/SessionService";
import SessionApi from "@api/session/SessionApi";

interface Services {
  sessionService: SessionService;
}

export function createApplicationServices(sessionApi: SessionApi): Services {
  const sessionService = new SessionService(sessionApi);

  return {
    sessionService,
  };
}
