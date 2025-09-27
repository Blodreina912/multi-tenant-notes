export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'member';
  tenantId: number;
  createdAt: string;
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  plan: 'free' | 'pro';
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  userId: number;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
  tenant: Tenant;
}

export interface JWTPayload {
  userId: number;
  tenantId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
