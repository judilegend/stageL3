import { User } from "@/types/user";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://192.168.88.87:5000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/user`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },
};
