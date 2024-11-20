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
  X,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useRouter, usePathname } from "next/navigation";
import { projectService } from "@/services/projectService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectSubmenu from "./ProjetSubMenu";
import { MobileSidebar } from "./MobileSidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

//implementer le read push url

export default function Navbar() {
  const [userMenu, setUserMenu] = useState(false);
  const [projectMenu, setProjectMenu] = useState(false);
  const { currentProject, selectProject } = useCurrentProject();
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useProjects();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  //notifications hook
  const { notifications, unreadCount, markAsRead } = useNotificationSocket();

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

  const handleProjectChange = async (projectId: string) => {
    await selectProject(projectId);
    const currentWorkspace = pathname?.split("/")[3] || "kanban";
    router.push(`/projets/${projectId}/${currentWorkspace}`);
    setProjectMenu(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("currentProjectId");
    router.push("/login");
    setUserMenu(false);
  };

  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";

  //declare la fonction click task
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (
      "data" in notification &&
      notification.data?.taskId &&
      currentProject?.id
    ) {
      // Construct URL with current project ID
      const taskUrl = `/projets/${currentProject.id}/taches`;
      router.push(taskUrl);
    }
  };

  //render notifications

  const renderNotificationContent = () => (
    <PopoverContent className="w-80 p-0" align="end">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() =>
                handleNotificationClick(notification as Notification)
              }
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </PopoverContent>
  );

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
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            {renderNotificationContent()}
          </Popover>

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
