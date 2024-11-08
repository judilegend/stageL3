import { Op } from "sequelize";
import Tache from "../models/tache";
import User from "../models/user";
export const createTache = async (TacheData: Partial<Tache>) => {
  return Tache.create(TacheData);
};

export const assignTache = async (TacheId: number, userId: number) => {
  const tache = await Tache.findByPk(TacheId);
  if (!tache) throw new Error("Tache not found");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  return tache.update({ assignedUserId: userId });
};
export const getTachesBySprintId = async (sprintId: number) => {
  return Tache.findAll({ where: { sprintId } });
};

export const updateTacheStatus = async (tacheId: number, status: string) => {
  const validStatuses = ["todo", "in_progress", "review", "done"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status provided");
  }

  const tache = await Tache.findByPk(tacheId);
  if (!tache) throw new Error("Task not found");

  return await tache.update({ status });
};

// Add these new methods
export const createTacheForActivite = async (
  activiteId: number,
  tacheData: Partial<Tache>
) => {
  return Tache.create({ ...tacheData, activiteId });
};

export const updateTacheAssignment = async (
  tacheId: number,
  userId: number | null
) => {
  const tache = await Tache.findByPk(tacheId);
  if (!tache) throw new Error("Tache not found");
  return tache.update({ assignedUserId: userId });
};

// export const updateTacheStatus = async (TacheId: number, status: string) => {
//   const tache = await Tache.findByPk(TacheId);
//   if (!tache) throw new Error("Tache not found");
//   return tache.update({ status });
// };
export const getTachesByActiviteId = async (activiteId: number) => {
  return await Tache.findAll({ where: { activiteId } });
};

export const updateTache = async (id: number, data: Partial<Tache>) => {
  const tache = await Tache.findByPk(id);
  if (!tache) throw new Error("Tache not found");
  return await tache.update(data);
};

export const deleteTache = async (id: number) => {
  const tache = await Tache.findByPk(id);
  if (!tache) throw new Error("Tache not found");
  await tache.destroy();
};
export const getTasksByCategory = async () => {
  const tasks = await Tache.findAll();

  return {
    importantUrgent: tasks.filter(
      (task) => task.importance === "important" && task.urgency === "urgent"
    ),
    importantNotUrgent: tasks.filter(
      (task) => task.importance === "important" && task.urgency === "not-urgent"
    ),
    notImportantUrgent: tasks.filter(
      (task) => task.importance === "not-important" && task.urgency === "urgent"
    ),
    notImportantNotUrgent: tasks.filter(
      (task) =>
        task.importance === "not-important" && task.urgency === "not-urgent"
    ),
  };
};
export const getAvailableTasks = async () => {
  return Tache.findAll({
    where: {
      status: {
        [Op.notIn]: ["done"],
      },
      sprintId: null,
    },
    order: [
      ["urgency", "DESC"],
      ["importance", "DESC"],
      ["createdAt", "ASC"],
    ],
  });
};
