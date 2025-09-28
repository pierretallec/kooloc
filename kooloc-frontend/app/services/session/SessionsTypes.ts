export type RefreshableJwtToken = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type SessionCredentials = {
  userName: string;
  password: string;
};
