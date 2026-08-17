export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
  vipActive: boolean;
  vipStartedAt: string | null;
  vipExpiresAt: string | null;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface VipGrantRequest {
  expiresAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
