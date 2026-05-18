import { api } from './api';

export type LoginBody = { identifier: string; password: string };

export type LoginResponse = {
  token: string;
  userToken: { name: string; userId: string; role: string };
};

export type RegisterBody = {
  phone: string;
  password: string;
  name?: string;
  shopName?: string;
  address?: string;
};

export type RegisterResponse = {
  msg: string;
  tokenUser: { name: string; userId: string; role: string };
};

export async function loginRequest(body: LoginBody): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', body);
  return data;
}

export async function registerRequest(
  body: RegisterBody
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', body);
  return data;
}
