import { Activity } from "@/types/activity";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getActivitiesByWorkPackageId(
  workPackageId: string
): Promise<Activity[]> {
  const response = await fetch(
    `${API_URL}/activities/workpackage/${workPackageId}`,
    {
      headers: getAuthHeaders(),
      credentials: "include",
    }
  );

  if (response.status === 401) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch activities");
  }

  return response.json();
}

export async function createActivity(
  data: Partial<Activity>
): Promise<Activity> {
  const response = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 401) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create activity");
  }

  return responseData;
}

export async function updateActivity(
  id: string,
  data: Partial<Activity>
): Promise<Activity> {
  const response = await fetch(`${API_URL}/activities/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update activity");
  }

  return response.json();
}

export async function deleteActivity(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/activities/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Authentication required");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete activity");
  }
}
