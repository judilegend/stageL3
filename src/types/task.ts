export type TaskPriority =
  | "important-urgent"
  | "important-not-urgent"
  | "not-important-urgent"
  | "not-important-not-urgent";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority:
    | "important-urgent"
    | "important-not-urgent"
    | "not-important-urgent"
    | "not-important-not-urgent";
  status: "todo" | "in-progress" | "done";
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}
