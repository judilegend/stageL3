import { Op, QueryTypes } from "sequelize";
import Tache from "../models/tache";
import User from "../models/user";
import sequelize from "../config/database";
import notificationService from "./notificationService";
export const createTache = async (TacheData: Partial<Tache>) => {
  const tache = await Tache.create(TacheData);

  // If task is assigned to someone, trigger notification
  if (TacheData.assignedUserId) {
    try {
      const result = await notificationService.notifyTaskAssignment(
        TacheData.assignedUserId,
        {
          id: tache.id,
          title: tache.title,
          assignedAt: new Date(),
        }
      );
      console.log("Notification created:", result); // Debug log
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  }

  return tache;
};

export const assignTache = async (TacheId: number, userId: number) => {
  const tache = await Tache.findByPk(TacheId);
  if (!tache) throw new Error("Tache not found");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await tache.update({ assignedUserId: userId });

  // Send notification for task assignment
  try {
    const result = await notificationService.notifyTaskAssignment(userId, {
      id: tache.id,
      title: tache.title,
      assignedAt: new Date(),
    });
    console.log("Assignment notification created:", result);
  } catch (error) {
    console.error("Failed to create assignment notification:", error);
  }

  return tache;
};

export const getTachesBySprintId = async (sprintId: number) => {
  return Tache.findAll({ where: { sprintId } });
};

export const updateTacheStatus = async (tacheId: number, status: string) => {
  const validStatuses = ["todo", "in_progress", "review", "done"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status provided");
  }

  const tache = await Tache.findByPk(tacheId, {
    include: [
      {
        model: User,
        as: "assignedUser",
      },
    ],
  });

  if (!tache) throw new Error("Task not found");

  // When task is marked as "review"
  if (status === "review") {
    // Notify Scrum Master, Lead Dev, and Tech Lead
    const leadRoles = await User.findAll({
      where: {
        role: {
          [Op.in]: ["SCRUM_MASTER", "LEAD_DEV", "TECH_LEAD"],
        },
      },
    });

    // Send notifications to all leads
    for (const lead of leadRoles) {
      await notificationService.notifyTaskAssignment(lead.id, {
        id: tacheId,
        title: `Review Required: ${tache.title}`,
        type: "TASK_REVIEW",
        data: {
          taskId: tacheId,
          developerId: tache.assignedUserId,
          status: "review",
        },
      });
    }
  }

  // When task is marked as "done" or returned to "todo"
  if (status === "done" || status === "todo") {
    // Notify the assigned developer
    if (tache.assignedUserId) {
      await notificationService.notifyTaskAssignment(tache.assignedUserId, {
        id: tacheId,
        title:
          status === "done"
            ? `Task Approved: ${tache.title}`
            : `Task Needs Revision: ${tache.title}`,
        type: status === "done" ? "TASK_APPROVED" : "TASK_REVISION",
        data: {
          taskId: tacheId,
          status: status,
        },
      });
    }
  }

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

  await tache.update({ assignedUserId: userId });

  if (userId) {
    try {
      const result = await notificationService.notifyTaskAssignment(userId, {
        id: tacheId,
        title: tache.title,
        assignedAt: new Date(),
      });
      console.log("Assignment notification created:", result); // Debug log
    } catch (error) {
      console.error("Failed to create assignment notification:", error);
    }
  }

  return tache;
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
// Ajouter cette nouvelle fonction
export const getTachesByProjectId = async (projectId: number) => {
  try {
    const tasks = await sequelize.query(
      `SELECT t.*, a.id as activity_id 
       FROM Taches t 
       JOIN Activites a ON t.activiteId = a.id 
       JOIN WorkPackages w ON a.workPackageId = w.id 
       WHERE w.projectId = :projectId`,
      {
        replacements: { projectId },
        type: QueryTypes.SELECT,
      }
    );

    return tasks.length > 0 ? tasks : [];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
};

export const getAllTaches = async () => {
  return await Tache.findAll({
    order: [["createdAt", "DESC"]],
    include: [User],
  });
};
