import React, { createContext, useContext, useState, useEffect } from "react";
import { Sprint, SprintInput } from "@/types";
import { sprintService } from "@/services/sprintService";
import { useCurrentProject } from "./CurrentProjectContext";

interface Filters {
  search: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface SprintContextType {
  sprints: Sprint[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  createSprint: (data: SprintInput) => Promise<void>;
  updateSprint: (id: number, data: Partial<Sprint>) => Promise<void>;
  deleteSprint: (id: number) => Promise<void>;
  addTaskToSprint: (sprintId: number, taskId: number) => Promise<void>;
  removeTaskFromSprint: (sprintId: number, taskId: number) => Promise<void>;
}

const SprintContext = createContext<SprintContextType | undefined>(undefined);

export function SprintProvider({ children }: { children: React.ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
  });
  const { currentProject } = useCurrentProject();

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      const data = await sprintService.getAllSprints();
      setSprints(data);
    } catch (err) {
      setError("Failed to fetch sprints");
    } finally {
      setLoading(false);
    }
  };

  const createSprint = async (data: SprintInput) => {
    try {
      const newSprint = await sprintService.createSprint(data);
      setSprints([...sprints, newSprint]);
    } catch (err) {
      setError("Failed to create sprint");
    }
  };

  // ... continuing from previous code
  const updateSprint = async (id: number, data: Partial<Sprint>) => {
    try {
      const updatedSprint = await sprintService.updateSprint(id, data);
      setSprints(
        sprints.map((sprint) => (sprint.id === id ? updatedSprint : sprint))
      );
    } catch (err) {
      setError("Failed to update sprint");
    }
  };

  const deleteSprint = async (id: number) => {
    try {
      await sprintService.deleteSprint(id);
      setSprints(sprints.filter((sprint) => sprint.id !== id));
    } catch (err) {
      setError("Failed to delete sprint");
    }
  };

  const addTaskToSprint = async (sprintId: number, taskId: number) => {
    try {
      const updatedSprint = await sprintService.addTaskToSprint(
        sprintId,
        taskId
      );
      setSprints(
        sprints.map((sprint) =>
          sprint.id === sprintId ? updatedSprint : sprint
        )
      );
    } catch (err) {
      setError("Failed to add task to sprint");
    }
  };

  const removeTaskFromSprint = async (sprintId: number, taskId: number) => {
    try {
      await sprintService.removeTaskFromSprint(sprintId, taskId);
      setSprints(
        sprints.map((sprint) => {
          if (sprint.id === sprintId) {
            return {
              ...sprint,
              tasks: sprint.tasks?.filter((task) => task.id !== taskId),
            };
          }
          return sprint;
        })
      );
    } catch (err) {
      setError("Failed to remove task from sprint");
    }
  };

  const value = {
    sprints,
    loading,
    error,
    filters,
    setFilters,
    createSprint,
    updateSprint,
    deleteSprint,
    addTaskToSprint,
    removeTaskFromSprint,
  };

  return (
    <SprintContext.Provider value={value}>{children}</SprintContext.Provider>
  );
}

export const useSprints = () => {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error("useSprints must be used within SprintProvider");
  }
  return context;
};
