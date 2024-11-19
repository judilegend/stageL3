"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Layout,
  ListTodo,
  MessageSquare,
  Activity,
  Archive,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import { useRouter, usePathname } from "next/navigation";
import { projectService } from "@/services/projectService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectSubmenu from "./ProjetSubMenu";
import { MobileSidebar } from "./MobileSidebar";

export default function Navbar() {
  const [userMenu, setUserMenu] = useState(false);
  const [projectMenu, setProjectMenu] = useState(false);
  const { currentProject, selectProject } = useCurrentProject();
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useProjects();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const storedProjectId = localStorage.getItem("currentProjectId");
    if (storedProjectId && !currentProject) {
      selectProject(storedProjectId);
    }
  }, []);

  const workspaceLinks = [
    {
      href: currentProject ? `/projets/${currentProject.id}/kanban` : "#",
      label: "Kanban",
      icon: Layout,
      value: "kanban",
    },
    {
      href: currentProject ? `/projets/${currentProject.id}/backlog` : "#",
      label: "Backlog",
      icon: Archive,
      value: "backlog",
    },
    {
      href: currentProject ? `/projets/${currentProject.id}/taches` : "#",
      label: "Tâches",
      icon: ListTodo,
      value: "taches",
    },
    {
      href: currentProject ? `/projets/${currentProject.id}/sprints` : "#",
      label: "Sprints",
      icon: Activity,
      value: "sprints",
    },
  ];

  const handleProjectChange = async (projectId: string) => {
    await selectProject(projectId);
    const currentWorkspace = pathname?.split("/")[3] || "kanban";
    router.push(`/projets/${projectId}/${currentWorkspace}`);
    setProjectMenu(false);
  };

  const getCurrentWorkspace = () => {
    const paths = pathname?.split("/");
    return paths?.[3] || "kanban";
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("currentProjectId");
    router.push("/login");
    setUserMenu(false);
  };

  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";

  return (
    <nav className="bg-white rounded-lg border-b mx-4 mt-3 border-gray-200 shadow-md">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <MobileSidebar
              isOpen={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
            />
          </div>
          <div className="relative">
            <div className="flex items-center gap-8">
              <span>Mes Projets</span>
              <button
                onClick={() => setProjectMenu(!projectMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <span className="font-medium">
                  {currentProject?.title || "Sélectionner un projet"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            {projectMenu && (
              <div className="absolute left-5 mt-2 w-64 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                {state.projects.map((project) => (
                  <ProjectSubmenu
                    key={project.id}
                    project={project}
                    onProjectSelect={handleProjectChange}
                    closeMenu={() => setProjectMenu(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* {currentProject && (
            <div className="flex gap-2">
              {workspaceLinks.map(({ href, label, icon: Icon, value }) => (
                <Link key={href} href={href}>
                  <Button
                    variant={
                      getCurrentWorkspace() === value ? "default" : "ghost"
                    }
                    className="gap-2 text-sm"
                    disabled={!currentProject}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          )} */}
        </div>

        <div className="flex items-center gap-4">
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
