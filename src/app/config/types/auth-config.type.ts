import { StringValue } from 'ms';

export type AuthConfig = {
  secret: string;
  expires: StringValue;
  refreshSecret: string;
  refreshExpires: StringValue;
  forgotSecret: string;
  forgotExpires: StringValue;
  confirmEmailSecret: string;
  confirmEmailExpires: StringValue;
  saltRounds: number;
  googleClientID: string;
  googleClientSecret?: string;
  googleCallbackURL: string;
  facebookAppID: string;
  facebookAppSecret: string;
  facebookCallbackURL: string;
  linkedinClientID: string;
  linkedinClientSecret: string;
  linkedinCallbackURL: string;
};
