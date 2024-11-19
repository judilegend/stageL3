import { Task } from "@/types/task";
import { User } from "@/types/user";

interface TaskStatusTransition {
  currentStatus: string;
  newStatus: string;
  task: Task;
  user: User;
}

export const taskStatusMiddleware = {
  canChangeStatus({
    currentStatus,
    newStatus,
    task,
    user,
  }: TaskStatusTransition): boolean {
    // Super users can do anything
    if (["lead_developer", "tech_lead", "scrum_master"].includes(user.role)) {
      return true;
    }

    // Regular user and developer permissions
    if (["user", "developper"].includes(user.role)) {
      // Can only modify their assigned tasks
      if (task.assignedUserId !== user.id) {
        return false;
      }

      // Allowed transitions for regular users and developers
      const allowedTransitions: Record<string, string[]> = {
        todo: ["in_progress"],
        in_progress: ["review"],
        review: ["in_progress"], // Can move back to in_progress but not to done
        done: [], // Cannot move from done
      };

      return allowedTransitions[currentStatus]?.includes(newStatus) || false;
    }

    return false;
  },

  validateStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      todo: ["in_progress"],
      in_progress: ["review", "todo"],
      review: ["done", "in_progress"],
      done: ["todo"],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  },
};
