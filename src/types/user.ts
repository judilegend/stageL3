export type UserRole = "admin" | "user" | "client";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_online: boolean;
  last_activity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  is_online?: boolean;
  last_activity?: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_online: boolean;
  last_activity: Date;
  createdAt: Date;
  updatedAt: Date;
}
