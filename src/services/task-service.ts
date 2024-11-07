import { Task } from "@/types/task";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getTasksByActivityId(
  activityId: string
): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks/activity/${activityId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(
  id: string,
  data: Partial<Task>
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
}

export async function assignTask(
  taskId: string,
  userId: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) throw new Error("Failed to assign task");
  return response.json();
}

export async function updateTaskStatus(
  taskId: string,
  status: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update task status");
  return response.json();
}
