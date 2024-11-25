"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import { useCurrentProject } from "./CurrentProjectContext";
import toast from "react-hot-toast";

type TaskState = {
  tasksByActivity: Record<number, Task[]>;
  availableTasks: Task[];
  projectTasks: Task[];
  allTasks: Task[];
  users: User[];
  loading: boolean;
  error: string | null;
};

type TaskAction =
  | { type: "SET_TASKS"; payload: { tasks: Task[]; activiteId: number } }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { taskId: number; activiteId: number } }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_AVAILABLE_TASKS"; payload: Task[] }
  | { type: "SET_ALL_TASKS"; payload: Task[] }
  | { type: "SET_PROJECT_TASKS"; payload: Task[] }
  | {
      type: "UPDATE_USER_ASSIGNMENT";
      payload: { taskId: number; userId: number };
    };

const TaskContext = createContext<
  | {
      state: TaskState;
      fetchTasks: (activiteId: number) => Promise<void>;
      createTask: (task: Omit<Task, "id">) => Promise<Task>;
      updateTask: (id: number, task: Partial<Task>) => Promise<Task>;
      deleteTask: (id: number, activiteId: number) => Promise<void>;
      assignTask: (taskId: number, userId: number) => Promise<void>;
      fetchAvailableTasks: () => Promise<void>;
      fetchAllTasks: () => Promise<void>;
      fetchProjectTasks: (projectId: number) => Promise<void>;
    }
  | undefined
>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]: action.payload.tasks,
        },
        loading: false,
      };
    case "ADD_TASK":
      return {
        ...state,
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]: [
            ...(state.tasksByActivity[action.payload.activiteId] || []),
            action.payload,
          ],
        },
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]:
            state.tasksByActivity[action.payload.activiteId]?.map((task) =>
              task.id === action.payload.id
                ? { ...task, ...action.payload }
                : task
            ) || [],
        },
        projectTasks: state.projectTasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    // ... previous reducer cases ...

    case "DELETE_TASK":
      return {
        ...state,
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]: state.tasksByActivity[
            action.payload.activiteId
          ].filter((task) => task.id !== action.payload.taskId),
        },
      };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_PROJECT_TASKS":
      return {
        ...state,
        projectTasks: action.payload,
        loading: false,
      };
    case "UPDATE_USER_ASSIGNMENT":
      // Update task assignment in all relevant state arrays
      return {
        ...state,
        tasksByActivity: Object.keys(state.tasksByActivity).reduce(
          (acc, activityId) => {
            acc[Number(activityId)] = state.tasksByActivity[
              Number(activityId)
            ].map((task) =>
              task.id === action.payload.taskId
                ? { ...task, assignedUserId: action.payload.userId }
                : task
            );
            return acc;
          },
          {} as Record<number, Task[]>
        ),
      };
    default:
      return state;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasksByActivity: {},
    availableTasks: [],
    projectTasks: [],
    allTasks: [],
    users: [],
    loading: false,
    error: null,
  });

  // Fetch tasks when project changes
  const { currentProject } = useCurrentProject();

  // Initialize users and tasks
  useEffect(() => {
    const initializeData = async () => {
      try {
        const users = await taskService.getUsers();
        dispatch({ type: "SET_USERS", payload: users });
        if (currentProject?.id) {
          await fetchProjectTasks(currentProject.id);
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to initialize data",
        });
      }
    };
    initializeData();
  }, [currentProject?.id]);

  // Task CRUD operations
  const createTask = async (taskData: Omit<Task, "id">): Promise<Task> => {
    try {
      const newTask = await taskService.createTask(taskData);
      dispatch({ type: "ADD_TASK", payload: newTask });
      return newTask;
    } catch (error) {
      toast.error("Échec de la création de la tâche");
      throw error;
    }
  };

  const updateTask = async (
    id: number,
    taskData: Partial<Task>
  ): Promise<Task> => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      return updatedTask;
    } catch (error) {
      toast.error("Échec de la mise à jour de la tâche");
      throw error;
    }
  };

  const assignTask = async (taskId: number, userId: number): Promise<void> => {
    try {
      const updatedTask = await taskService.assignTask(taskId, userId);
      dispatch({
        type: "UPDATE_USER_ASSIGNMENT",
        payload: { taskId, userId },
      });
      toast.success("Tâche assignée avec succès");
    } catch (error) {
      toast.error("Échec de l'assignation de la tâche");
      throw error;
    }
  };

  // Fetch operations
  const fetchTasks = async (activiteId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getTasks(activiteId);
      dispatch({ type: "SET_TASKS", payload: { tasks, activiteId } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch tasks",
      });
    }
  };

  const fetchProjectTasks = async (projectId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      dispatch({ type: "SET_PROJECT_TASKS", payload: tasks });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch project tasks",
      });
    }
  };

  const value = {
    state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask: async (id: number, activiteId: number) => {
      try {
        await taskService.deleteTask(id);
        dispatch({
          type: "DELETE_TASK",
          payload: { taskId: id, activiteId },
        });
        toast.success("Tâche supprimée avec succès");
      } catch (error) {
        toast.error("Échec de la suppression de la tâche");
        throw error;
      }
    },
    assignTask,
    fetchAvailableTasks: async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const tasks = await taskService.getAvailableTasks();
        dispatch({ type: "SET_AVAILABLE_TASKS", payload: tasks });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to fetch available tasks",
        });
      }
    },
    fetchAllTasks: async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const tasks = await taskService.getAllTasks();
        dispatch({ type: "SET_ALL_TASKS", payload: tasks });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to fetch all tasks",
        });
      }
    },
    fetchProjectTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
