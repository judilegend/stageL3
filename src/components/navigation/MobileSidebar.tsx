"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  MessageSquare,
  Archive,
  PlusCircle,
  Activity,
  Users,
  Menu,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProject } from "@/contexts/CurrentProjectContext";
import CreateProjectDialog from "../projets/CreateProjectDialog";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Logo } from "../ui/Logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { useUserGuards } from "@/middleware/guards/userGuards";
import { useProjectGuards } from "@/middleware/guards/projectGuards";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ isOpen, onOpenChange }: MobileSidebarProps) {
  const { canAccessUserManagement } = useUserGuards();
  const { user, isAuthenticated } = useAuth();
  const { currentProject } = useCurrentProject();
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";
  const { canCreateProject } = useProjectGuards();

  const menuItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Flux de travail",
      url: currentProject ? `/projets/${currentProject.id}/kanban` : "",
      icon: FolderKanban,
    },
    {
      title: "Kanban",
      url: currentProject
        ? `/projets/${currentProject.id}/backlog`
        : "/backlog",
      icon: Archive,
      requiresProject: true,
    },
    {
      title: "Sprints",
      url: currentProject
        ? `/projets/${currentProject.id}/sprints`
        : "/sprints",
      icon: Activity,
      requiresProject: true,
    },
    {
      title: "Gestion des tâches",
      url: currentProject ? `/projets/${currentProject.id}/taches` : "/taches",
      icon: ListTodo,
      requiresProject: true,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Gerer user",
      url: "/gestion-utilisateurs",
      icon: Users,
      show: canAccessUserManagement,
    },
  ].filter((item) => !item.show || item.show());

  const handleNavigation = async (
    url: string,
    requiresProject: boolean = false
  ) => {
    if (requiresProject && !currentProject) {
      return;
    }

    setIsLoading(true);
    try {
      await router.push(url);
      onOpenChange(false);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Menu de navigation"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SheetTitle className="sr-only">Menu de navigation mobile</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="p-4 border-b text-xl font-semibold">
              <Logo />
            </div>

            {isAuthenticated && canCreateProject() && (
              <div className="p-4">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Créer un projet
                </Button>
              </div>
            )}

            <nav
              className="flex-1 space-y-1 px-4 py-2"
              role="navigation"
              aria-label="Menu principal"
            >
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() =>
                    handleNavigation(item.url, item.requiresProject)
                  }
                  disabled={item.requiresProject && !currentProject}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors relative group",
                    pathname === item.url
                      ? "bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    item.requiresProject &&
                      !currentProject &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  aria-current={pathname === item.url ? "page" : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      pathname === item.url
                        ? "text-gray-500"
                        : "text-gray-500 group-hover:text-gray-900"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "font-medium",
                      pathname === item.url
                        ? "text-gray-500"
                        : "text-gray-700 group-hover:text-gray-900"
                    )}
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </nav>

            <div className="border-t p-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {userInitial}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CreateProjectDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
