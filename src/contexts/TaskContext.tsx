"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/task";

type TaskState = {
  tasksByActivity: Record<number, Task[]>;
  loading: boolean;
  error: string | null;
};

type TaskAction =
  | { type: "SET_TASKS"; payload: { tasks: Task[]; activiteId: number } }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { taskId: number; activiteId: number } }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const TaskContext = createContext<
  | {
      state: TaskState;
      dispatch: React.Dispatch<TaskAction>;
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
            task.id === action.payload.id ? action.payload : task
          ),
        },
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasksByActivity: {
          ...state.tasksByActivity,
          [action.payload.activiteId]: (
            state.tasksByActivity[action.payload.activiteId] || []
          ).filter((task) => task.id !== action.payload.taskId),
        },
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
    tasksByActivity: {},
    loading: false,
    error: null,
  });

  const fetchTasks = async (activiteId: number) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const tasks = await taskService.getTasks(activiteId);
      dispatch({ type: "SET_TASKS", payload: { tasks, activiteId } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to fetch tasks",
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
        payload:
          error instanceof Error ? error.message : "Failed to create task",
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
        payload:
          error instanceof Error ? error.message : "Failed to update task",
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
      // Then refresh the tasks list with the correct activiteId
      console.log("activiteId", activiteId);
      const tasks = await taskService.getTasks(activiteId);
      dispatch({ type: "SET_TASKS", payload: { tasks, activiteId } });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete task",
      });
    }
  };

  const assignTask = async (taskId: number, userId: number) => {
    try {
      const updatedTask = await taskService.assignTask(taskId, userId);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to assign task",
      });
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
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
