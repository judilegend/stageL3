export interface Activity {
  id: string;
  workPackageId: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  createdAt: Date;
  updatedAt: Date;
}
