"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Activity } from "@/types/activity";
import * as activityService from "@/services/activity-service";
import { useActivityGuards } from "@/middleware/guards/projectGuards";

interface ActivityContextType {
  activities: Activity[];
  fetchActivities: (workPackageId: string) => Promise<void>;
  addActivity: (activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { canCreateActivity, canEditActivity, canDeleteActivity } =
    useActivityGuards();

  const fetchActivities = useCallback(async (workPackageId: string) => {
    try {
      const data = await activityService.getActivitiesByWorkPackageId(
        workPackageId
      );
      setActivities((prevActivities) => {
        const filteredPrevActivities = prevActivities.filter(
          (act) => act.workPackageId !== workPackageId
        );
        return [...filteredPrevActivities, ...data];
      });
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  }, []);

  const value = {
    activities,
    fetchActivities,
    addActivity: async (activity: Partial<Activity>) => {
      if (!canCreateActivity()) {
        throw new Error("Unauthorized to create activity");
      }
      const newActivity = await activityService.createActivity(activity);
      setActivities((prev) => [...prev, newActivity]);
    },
    deleteActivity: async (id: string) => {
      if (!canDeleteActivity()) {
        throw new Error("Unauthorized to delete activity");
      }
      await activityService.deleteActivity(id);
      setActivities((prev) => prev.filter((act) => act.id !== id));
    },
    updateActivity: async (id: string, activity: Partial<Activity>) => {
      if (!canEditActivity()) {
        throw new Error("Unauthorized to edit activity");
      }
      const updatedActivity = await activityService.updateActivity(
        id,
        activity
      );
      setActivities((prev) =>
        prev.map((act) => (act.id === id ? updatedActivity : act))
      );
    },
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context)
    throw new Error("useActivity must be used within an ActivityProvider");
  return context;
};
