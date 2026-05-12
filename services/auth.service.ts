import { api } from './api';

export type LoginBody = { identifier: string; password: string };

export type LoginResponse = {
  token: string;
  userToken: { name: string; userId: string; role: string };
};

export async function loginRequest(body: LoginBody): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', body);
  return data;
}
