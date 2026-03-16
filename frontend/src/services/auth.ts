import api from './api';
import type { AuthResponse, User } from '@/types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    name,
  });
  localStorage.setItem('token', response.data.token);
  return response.data;
}

export async function refreshToken(): Promise<{ token: string }> {
  const response = await api.post<{ token: string }>('/auth/refresh');
  localStorage.setItem('token', response.data.token);
  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/auth/profile');
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('token');
  window.location.href = '/';
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}
