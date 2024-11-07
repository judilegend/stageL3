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

type TaskState = {
  tasksByActivity: Record<number, Task[]>;
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
          [action.payload.activiteId]: state.tasksByActivity[
            action.payload.activiteId
          ].map((task) =>
            task.id === action.payload.id
              ? { ...task, ...action.payload }
              : task
          ),
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
    users: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const initializeUsers = async () => {
      try {
        const users = await taskService.getUsers();
        dispatch({ type: "SET_USERS", payload: users });
      } catch (error) {
        console.error("Failed to initialize users:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load users. Please refresh the page.",
        });
      }
    };
    initializeUsers();
  }, []);

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
    createTask,
    updateTask,
    deleteTask,
    assignTask,
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
