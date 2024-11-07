import { Task } from "@/types/task";
import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const taskService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/user`, {
      credentials: "include",
      headers: defaultHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async getTasks(activiteId: number): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks/activity/${activiteId}`, {
      credentials: "include",
      headers: defaultHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  async createTask(taskData: Omit<Task, "id">): Promise<Task> {
    const response = await fetch(
      `${API_URL}/tasks/activite/${taskData.activiteId}`,
      {
        method: "POST",
        headers: defaultHeaders,
        credentials: "include",
        body: JSON.stringify(taskData),
      }
    );
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials: "include",
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: defaultHeaders,
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },

  async assignTask(taskId: number, userId: number): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
      method: "PUT",
      headers: defaultHeaders,
      credentials: "include",
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("Failed to assign task");
    return response.json();
  },
};
