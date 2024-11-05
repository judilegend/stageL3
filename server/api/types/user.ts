export type UserRole = "admin" | "user" | "client";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
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
  is_online?: boolean;
  last_activity?: Date;
}

export interface UpdateUserDTO {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  is_online?: boolean;
  last_activity?: Date;
}
