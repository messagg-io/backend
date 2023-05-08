export interface IRawJwtPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}
