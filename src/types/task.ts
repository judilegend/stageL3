export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  activiteId: number;
  assignedUserId: number | null;
  estimatedPomodoros: number;
  completedPomodoros: number;
  urgency: "urgent" | "not-urgent";
  importance: "important" | "not-important";
  createdAt: string;
  updatedAt: string;
}
