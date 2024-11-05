import { ProjectStatus } from "@/types/project";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const getProjectStatusColor = (status: ProjectStatus) => {
  const statusColors = {
    submitted: "yellow",
    in_review: "blue",
    approved: "green",
    rejected: "red",
  };
  return statusColors[status];
};
