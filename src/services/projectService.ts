import { Project } from "@/types/project";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.88.87:5000/api";

export const projectService = {
  async getAllProjects() {
    const response = await fetch(`${API_URL}/projects`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  async createProject(projectData: Omit<Project, "id">) {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },

  async updateProject(id: string, projectData: Partial<Project>) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
  },

  async deleteProject(id: string) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete project");
  },

  async getProjectById(id: string) {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
  },
};
