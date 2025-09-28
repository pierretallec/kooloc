import SessionApi from "@api/session/SessionApi";
import type { RefreshableJwtToken, SessionCredentials } from "./SessionsTypes";
import type { UserWithExpiration, User } from "./User";

const LOCAL_STORAGE_SESSION_KEY: string = "user-session";
const TOKEN_REFRESH_THRESHOLD_MS: number = 60 * 1000; // 1 minute

export default class SessionService {
  private currentSession: RefreshableJwtToken | null = null;
  private refreshIntervalId: number | null = null;
  private sessionApi: SessionApi;

  constructor(sessionApi: SessionApi) {
    this.sessionApi = sessionApi;
    this.initializeSession();
  }

  public isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.expiresIn > Date.now();
  }

  public getSessionToken(): string | null {
    return this.isAuthenticated()
      ? this.currentSession?.accessToken ?? null
      : null;
  }

  public getCurrentUser(): User | null {
    const token = this.getSessionToken();
    if (!token) return null;
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      return tokenPayload as User;
    } catch (e) {
      console.error("Failed to decode token:", e);
      return null;
    }
  }

  public hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    if ("permissions" in user && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }
    return false;
  }

  public async authenticate(credentials: SessionCredentials): Promise<void> {
    const sessionToken = await this.sessionApi.authenticate(credentials);
    this.setSession(sessionToken);
  }

  public async register(credentials: SessionCredentials): Promise<void> {
    const sessionToken = await this.sessionApi.register(credentials);
    this.setSession(sessionToken);
  }

  public disconnect(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
    this.currentSession = null;
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  }

  // Private Helpers
  private setSession(sessionToken: RefreshableJwtToken): void {
    this.currentSession = sessionToken;
    localStorage.setItem(
      LOCAL_STORAGE_SESSION_KEY,
      JSON.stringify(sessionToken)
    );
    this.scheduleTokenRefresh();
  }

  private initializeSession(): void {
    const sessionData = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      this.currentSession = parsedSession;
      if (this.isAuthenticated()) {
        this.scheduleTokenRefresh();
      } else {
        this.disconnect();
      }
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshIntervalId) clearInterval(this.refreshIntervalId);

    const expiresIn = this.currentSession!.expiresIn;
    const refreshDelay = expiresIn - Date.now() - TOKEN_REFRESH_THRESHOLD_MS;

    if (refreshDelay > 0) {
      this.refreshIntervalId = window.setInterval(async () => {
        try {
          const newToken = await this.sessionApi.refresh(
            this.currentSession!.refreshToken!
          );
          this.setSession(newToken);
        } catch (error) {
          console.error("Failed to refresh token:", error);
          this.disconnect();
        }
      }, refreshDelay);
    } else {
      this.disconnect();
    }
  }
}
