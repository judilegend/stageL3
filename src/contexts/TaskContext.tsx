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

type TaskState = {
  tasksByActivity: Record<number, Task[]>;
  availableTasks: Task[];
  projectTasks: Task[]; // Explicitly typed as Task array
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
  | { type: "SET_PROJECT_TASKS"; payload: Task[] } // Add this line
  | {
      type: "UPDATE_USER_ASSIGNMENT";
      payload: { taskId: number; userId: number };
    };

const TaskContext = createContext<
  | {
      state: TaskState;
      fetchTasks: (activiteId: number) => Promise<void>;
      createTask: (task: Omit<Task, "id">) => Promise<void>;
      updateTask: (id: number, task: Partial<Task>) => Promise<void>;
      deleteTask: (id: number, activiteId: number) => Promise<void>;
      assignTask: (taskId: number, userId: number) => Promise<void>;
      fetchAvailableTasks: () => Promise<void>;
      fetchAllTasks: () => Promise<void>;
      fetchProjectTasks: (projectId: number) => Promise<void>; // Add this line
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
    case "SET_AVAILABLE_TASKS":
      return {
        ...state,
        availableTasks: action.payload,
        loading: false,
      };
    case "SET_ALL_TASKS":
      return {
        ...state,
        allTasks: action.payload,
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
        projectTasks: Array.isArray(state.projectTasks)
          ? state.projectTasks.map((task) =>
              task.id === action.payload.id
                ? { ...task, ...action.payload }
                : task
            )
          : [],
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]:
            state.tasksByActivity[action.payload.activiteId]?.map((task) =>
              task.id === action.payload.id
                ? { ...task, ...action.payload }
                : task
            ) || [],
        },
      };
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
        error: null,
      };

    case "UPDATE_USER_ASSIGNMENT":
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
    projectTasks: [], // Add this line
    users: [],
    allTasks: [],
    loading: false,
    error: null,
  });
  const { currentProject } = useCurrentProject();

  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const users = await taskService.getUsers();
        dispatch({ type: "SET_USERS", payload: users });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load users. Please refresh the page.",
        });
      }
    };
    initializeUsers();
    fetchTasks(currentProject?.id || 0);
  }, []);
  const fetchAllTasks = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getAllTasks();
      dispatch({ type: "SET_ALL_TASKS", payload: tasks });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch all tasks. Please try again.",
      });
    }
  };
  const fetchTasks = async (activiteId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getTasks(activiteId);
      dispatch({ type: "SET_TASKS", payload: { tasks, activiteId } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch tasks. Please try again.",
      });
    }
  };

  const fetchAvailableTasks = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getAvailableTasks();
      dispatch({ type: "SET_AVAILABLE_TASKS", payload: tasks });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch available tasks. Please try again.",
      });
    }
  };
  // const fetchProjectTasks = async (projectId: number) => {
  //   dispatch({ type: "SET_LOADING" });
  //   try {
  //     const tasks = await taskService.getTasksByProject(projectId);
  //     const tasksArray = Array.isArray(tasks) ? tasks : [];
  //     dispatch({ type: "SET_PROJECT_TASKS", payload: tasksArray });
  //   } catch (error) {
  //     dispatch({
  //       type: "SET_ERROR",
  //       payload: "Failed to fetch project tasks. Please try again.",
  //     });
  //   }
  // };
  const fetchProjectTasks = async (projectId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      dispatch({ type: "SET_PROJECT_TASKS", payload: tasks });
    } catch (error) {
      console.error("Error in fetchProjectTasks:", error);
      dispatch({ type: "SET_PROJECT_TASKS", payload: [] });
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  const createTask = async (task: Omit<Task, "id">) => {
    try {
      const newTask = await taskService.createTask(task);
      dispatch({ type: "ADD_TASK", payload: newTask });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to create task. Please try again.",
      });
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, task);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to update task. Please try again.",
      });
    }
  };

  const deleteTask = async (id: number, activiteId: number) => {
    try {
      await taskService.deleteTask(id);
      dispatch({
        type: "DELETE_TASK",
        payload: { taskId: id, activiteId },
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to delete task. Please try again.",
      });
    }
  };

  const assignTask = async (taskId: number, userId: number) => {
    try {
      const updatedTask = await taskService.assignTask(taskId, userId);
      dispatch({ type: "UPDATE_USER_ASSIGNMENT", payload: { taskId, userId } });
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to assign task. Please try again.",
      });
    }
  };

  const value = {
    state,
    fetchTasks,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    fetchAvailableTasks,
    fetchProjectTasks, // Add this line
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
