"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useRouter, usePathname } from "next/navigation";
import { projectService } from "@/services/projectService";
import { Project } from "@/types/project";

interface NavbarProps {
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export default function Navbar({ onMenuClick, isMobileMenuOpen }: NavbarProps) {
  const [userMenu, setUserMenu] = useState(false);
  const [projectMenu, setProjectMenu] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useProjects();

  useEffect(() => {
    const loadProjects = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const projects = await projectService.getAllProjects();
        dispatch({ type: "SET_PROJECTS", payload: projects });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Erreur de chargement des projets",
        });
      }
    };
    loadProjects();
  }, [dispatch]);

  useEffect(() => {
    if (pathname) {
      const projectId = pathname.split("/")[2];
      if (projectId) {
        const loadCurrentProject = async () => {
          try {
            const project = await projectService.getProjectById(projectId);
            setCurrentProject(project);
          } catch (error) {
            console.error("Erreur lors du chargement du projet:", error);
          }
        };
        loadCurrentProject();
      }
    }
  }, [pathname]);

  const handleProjectChange = (projectId: string) => {
    router.push(`/projets/${projectId}/kanban`);
    setProjectMenu(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    router.push("/login");
  };

  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";

  return (
    <nav className="bg-white rounded-lg border-b mx-4 mt-3 border-gray-200 shadow-md">
      <div className="flex justify-between items-center px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setProjectMenu(!projectMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="font-medium">
                {currentProject
                  ? currentProject.title
                  : "Sélectionner un projet"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {projectMenu && (
              <div className="absolute left-0 mt-2 w-64 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                {state.projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectChange(project.id.toString())}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {project.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
              aria-label="Menu utilisateur"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">{userInitial}</span>
              </div>
            </button>

            {userMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-sm text-gray-900">
                    {user?.username}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
