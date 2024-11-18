import { WorkPackage } from "@/types/workpackage";
import Cookies from "js-cookie";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://192.168.88.87:5000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getWorkPackagesByProjectId(
  projectId: string
): Promise<WorkPackage[]> {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/workpackages/project/${projectId}`, {
    cache: "no-store", // Prevents caching and infinite loops
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch work packages");
  return response.json();
}

export async function createWorkPackage(
  data: Partial<WorkPackage>
): Promise<WorkPackage> {
  const token = Cookies.get("token");
  console.log("Token present:", !!token); // Debug log

  const response = await fetch(`${API_URL}/workpackages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log("Server response:", responseData); // Debug log

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create work package");
  }

  return responseData;
}

export async function updateWorkPackage(
  id: string,
  data: Partial<WorkPackage>
): Promise<WorkPackage> {
  const token = Cookies.get("token");

  const response = await fetch(`${API_URL}/workpackages/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update work package");
  return response.json();
}

export async function deleteWorkPackage(id: string): Promise<void> {
  const token = Cookies.get("token");
  const response = await fetch(`${API_URL}/workpackages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete work package");
  }
}
