import { Activity } from "@/types/activity";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://192.168.88.87:5000/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getActivitiesByWorkPackageId(
  workPackageId: string
): Promise<Activity[]> {
  const response = await fetch(
    `${API_URL}/activities/workpackage/${workPackageId}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch activities");
  }
  return response.json();
}

export async function createActivity(
  data: Partial<Activity>
): Promise<Activity> {
  const response = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create activity");
  return response.json();
}

export async function updateActivity(
  id: string,
  data: Partial<Activity>
): Promise<Activity> {
  const response = await fetch(`${API_URL}/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update activity");
  return response.json();
}

export async function deleteActivity(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/activities/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete activity");
  }
}
