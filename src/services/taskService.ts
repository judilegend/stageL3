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
      next: { revalidate: 60 }, // Cache for 60 seconds
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

  // async assignTask(taskId: number, userId: number): Promise<Task> {
  //   const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
  //     method: "PUT",
  //     headers: defaultHeaders,
  //     credentials: "include",
  //     body: JSON.stringify({ userId }),
  //   });
  //   if (!response.ok) throw new Error("Failed to assign task");
  //   return response.json();
  // },
  async assignTask(taskId: number, userId: number): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
      method: "PUT",
      headers: {
        ...defaultHeaders,
        "Push-Enabled": "true",
      },
      credentials: "include",
      body: JSON.stringify({
        userId,
        subscription: await this.getSubscription(),
      }),
    });

    if (!response.ok) throw new Error("Failed to assign task");
    return response.json();
  },
  async getTasksByCategory(): Promise<Record<string, Task[]>> {
    const response = await fetch(`${API_URL}/tasks/categories`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch categorized tasks");
    return response.json();
  },
  async getAvailableTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks/available`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch available tasks");
    return response.json();
  },
  // async getTasksByProject(projectId: number): Promise<Task[]> {
  //   const response = await fetch(`${API_URL}/tasks/project/${projectId}`, {
  //     credentials: "include",
  //     headers: defaultHeaders,
  //   });
  //   if (!response.ok) throw new Error("Failed to fetch project tasks");
  //   return response.json();
  // },
  async getTasksByProject(projectId: number): Promise<Task[]> {
    try {
      const response = await fetch(`${API_URL}/tasks/project/${projectId}`, {
        credentials: "include",
        headers: defaultHeaders,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data ? [data] : [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks/all`, {
      credentials: "include",
      headers: defaultHeaders,
    });
    if (!response.ok) throw new Error("Failed to fetch all tasks");
    return response.json();
  },
  async getSubscription(): Promise<PushSubscription | null> {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      return registration.pushManager.getSubscription();
    }
    return null;
  },
};
