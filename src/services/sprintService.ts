import axios from "axios";
import { Sprint, SprintInput, Task } from "@/types";

const API_URL = "http://localhost:5000/api/sprints";

export const sprintService = {
  async getAllSprints(): Promise<Sprint[]> {
    const { data } = await axios.get(API_URL);
    return data;
  },

  async createSprint(sprintData: SprintInput): Promise<Sprint> {
    const { data } = await axios.post(API_URL, sprintData);
    return data;
  },

  async updateSprint(id: number, sprintData: Partial<Sprint>): Promise<Sprint> {
    const { data } = await axios.put(`${API_URL}/${id}`, sprintData);
    return data;
  },

  async deleteSprint(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },

  async addTaskToSprint(sprintId: number, taskId: number): Promise<Sprint> {
    const { data } = await axios.post(`${API_URL}/${sprintId}/tasks`, {
      taskId,
    });
    return data;
  },

  async removeTaskFromSprint(sprintId: number, taskId: number): Promise<void> {
    await axios.delete(`${API_URL}/${sprintId}/tasks/${taskId}`);
  },

  async getSprintTasks(sprintId: number): Promise<Task[]> {
    const { data } = await axios.get(`${API_URL}/${sprintId}/tasks`);
    return data;
  },
  async getSprintsByProject(projectId: number): Promise<Sprint[]> {
    const { data } = await axios.get(`${API_URL}/project/${projectId}/sprints`);
    return data;
  },
};
