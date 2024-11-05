"use client";

import { useEffect } from "react";
import { useProjects } from "@/contexts/ProjectContext";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

interface ProjectListProps {
  initialProjects: Project[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const { state, dispatch } = useProjects();

  useEffect(() => {
    dispatch({ type: "SET_PROJECTS", payload: initialProjects });
  }, [initialProjects, dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {state.projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
