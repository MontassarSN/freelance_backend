export type JwtPayloadType = {
  user_id: string;
  session_id: string;
  hash: string;
  iat: number;
  exp: number;
};
