export interface SignUp {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  user: {
    id: number;
  };
}
