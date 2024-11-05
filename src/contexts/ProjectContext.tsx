"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Project } from "@/types/project";

type ProjectState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
};

type ProjectAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const ProjectContext = createContext<
  | {
      state: ProjectState;
      dispatch: React.Dispatch<ProjectAction>;
    }
  | undefined
>(undefined);

const projectReducer = (
  state: ProjectState,
  action: ProjectAction
): ProjectState => {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, loading: false };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== parseInt(action.payload)
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, {
    projects: [],
    loading: false,
    error: null,
  });

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
