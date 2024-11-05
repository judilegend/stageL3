"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
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
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const TaskContext = createContext<
  | {
      state: TaskState;
      dispatch: React.Dispatch<TaskAction>;
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

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
