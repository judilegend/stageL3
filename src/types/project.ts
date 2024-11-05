export type ProjectStatus = "submitted" | "in_review" | "approved" | "rejected";

export interface Project {
  id: number;
  title: string;
  description: string;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  clientEmail: string;
  requestedBudgetLowwer: number;
  requestedBudgetUpper: number;
  deadline: Date;
  status: ProjectStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  title: string;
  description: string;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  clientEmail: string;
  requestedBudgetLowwer: number;
  requestedBudgetUpper: number;
  deadline: Date;
  status?: ProjectStatus;
  progress?: number;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  clientName?: string;
  clientSurname?: string;
  clientPhone?: string;
  clientEmail?: string;
  requestedBudgetLowwer?: number;
  requestedBudgetUpper?: number;
  deadline?: Date;
  status?: ProjectStatus;
  progress?: number;
}
