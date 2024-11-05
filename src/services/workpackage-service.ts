import { WorkPackage } from "@/types/workpackage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getWorkPackagesByProjectId(
  projectId: string
): Promise<WorkPackage[]> {
  const response = await fetch(`${API_URL}/workpackages/project/${projectId}`, {
    cache: "no-store", // Prevents caching and infinite loops
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch work packages");
  return response.json();
}

export async function createWorkPackage(
  data: Partial<WorkPackage>
): Promise<WorkPackage> {
  const response = await fetch(`${API_URL}/workpackages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create work package");
  return response.json();
}

export async function updateWorkPackage(
  id: string,
  data: Partial<WorkPackage>
): Promise<WorkPackage> {
  const response = await fetch(`${API_URL}/workpackages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update work package");
  return response.json();
}

export async function deleteWorkPackage(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/workpackages/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete work package");
  }
}
