export interface Sprint {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  progress: number;
  status: "planned" | "in_progress" | "completed";
  tasks?: Task[];
}

export interface Task {
  id: number;
  sprintId: number | null;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  assignedUserId: number | null;
  estimatedPomodoros: number;
  completedPomodoros: number;
  urgency: "urgent" | "not-urgent";
  importance: "important" | "not-important";
}

export interface SprintInput {
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
  status?: "planned" | "in_progress" | "completed";
}

export interface TaskInput {
  title: string;
  description: string;
  estimatedPomodoros: number;
  urgency: "urgent" | "not-urgent";
  importance: "important" | "not-important";
  sprintId?: number;
}
