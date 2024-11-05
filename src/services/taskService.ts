import { Task, TaskPriority, TaskStatus } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const taskService = {
  async getAllTasks() {
    const response = await fetch(`${API_URL}/tasks`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  async getTasksByProject(projectId: string) {
    const response = await fetch(`${API_URL}/tasks/project/${projectId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch project tasks");
    return response.json();
  },

  async createTask(taskData: Omit<Task, "id">) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  async updateTask(id: string, taskData: Partial<Task>) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  async deleteTask(id: string) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },

  async updateTaskStatus(id: string, status: TaskStatus) {
    const response = await fetch(`${API_URL}/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update task status");
    return response.json();
  },

  async updateTaskPriority(id: string, priority: TaskPriority) {
    const response = await fetch(`${API_URL}/tasks/${id}/priority`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ priority }),
    });
    if (!response.ok) throw new Error("Failed to update task priority");
    return response.json();
  },
};
