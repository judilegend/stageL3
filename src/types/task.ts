export interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  activiteId: number;
  sprintId: number | null; // Add this line
  projectId: number | null; // Add this line
  assignedUserId: number | null;
  estimatedPomodoros: number;
  completedPomodoros: number;
  urgency: "urgent" | "not-urgent";
  importance: "important" | "not-important";
  createdAt: string;
  updatedAt: string;
}
