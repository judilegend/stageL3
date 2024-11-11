import Sprint from "../models/sprint";
import Task from "../models/tache";
import { Op } from "sequelize";

class SprintService {
  async createSprint(sprintData: any) {
    return await Sprint.create(sprintData);
  }

  async getAllSprints() {
    return await Sprint.findAll({
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
      order: [["startDate", "DESC"]],
    });
  }

  async getSprintById(id: number) {
    return await Sprint.findByPk(id, {
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });
  }

  async updateSprint(id: number, updateData: any) {
    const sprint = await Sprint.findByPk(id);
    if (!sprint) throw new Error("Sprint not found");
    return await sprint.update(updateData);
  }

  async deleteSprint(id: number) {
    const sprint = await Sprint.findByPk(id);
    if (!sprint) throw new Error("Sprint not found");
    await sprint.destroy();
    return { message: "Sprint deleted successfully" };
  }

  async addTaskToSprint(sprintId: number, taskId: number) {
    const sprint = await Sprint.findByPk(sprintId);
    const task = await Task.findByPk(taskId);

    if (!sprint || !task) {
      throw new Error("Sprint or Task not found");
    }

    await task.update({ sprintId });
    return task;
  }

  async updateSprintProgress(sprintId: number) {
    const sprint = await Sprint.findByPk(sprintId, {
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });

    if (!sprint) throw new Error("Sprint not found");

    const tasks = sprint.tasks || [];
    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;
    const progress =
      tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    await sprint.update({ progress });
    return sprint;
  }

  async getActiveSprintTasks(sprintId: number) {
    return await Task.findAll({
      where: {
        sprintId,
        status: {
          [Op.ne]: "done",
        },
      },
    });
  }
}

export default new SprintService();
