import { Project } from "@/types/project";
import Cookies from "js-cookie";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://192.168.88.87:5000/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const projectService = {
  async getAllProjects() {
    const token = Cookies.get("token");
    const response = await fetch(`${API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  async createProject(projectData: Omit<Project, "id">) {
    const token = Cookies.get("token");
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });

    if (response.status === 401) {
      throw new Error("Authentication required");
    }

    if (response.status === 403) {
      throw new Error("You don't have permission to create projects");
    }

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

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
