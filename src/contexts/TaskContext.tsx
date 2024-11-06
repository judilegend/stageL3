"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/task";

type TaskState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

type TaskAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const TaskContext = createContext<
  | {
      state: TaskState;
      dispatch: React.Dispatch<TaskAction>;
      fetchTasks: (activiteId: number) => Promise<void>;
      createTask: (task: Omit<Task, "id">) => Promise<void>;
      updateTask: (id: number, task: Partial<Task>) => Promise<void>;
      deleteTask: (id: number) => Promise<void>;
      assignTask: (taskId: number, userId: number) => Promise<void>;
    }
  | undefined
>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  const fetchTasks = async (activiteId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await taskService.getTasks(activiteId);
      dispatch({ type: "SET_TASKS", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const createTask = async (task: Omit<Task, "id">) => {
    try {
      const data = await taskService.createTask(task);
      dispatch({ type: "ADD_TASK", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      const data = await taskService.updateTask(id, task);
      dispatch({ type: "UPDATE_TASK", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  const assignTask = async (taskId: number, userId: number) => {
    try {
      const data = await taskService.assignTask(taskId, userId);
      dispatch({ type: "UPDATE_TASK", payload: data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        dispatch,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        assignTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
