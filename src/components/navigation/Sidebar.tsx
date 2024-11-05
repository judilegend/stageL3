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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CreateProjectDialog from "../projets/CreateProjectDialog";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projets",
    url: "/projets",
    icon: FolderKanban,
  },
  {
    title: "Product Backlog",
    url: "/backlog",
    icon: Archive,
  },
  {
    title: "Gestion des tâches",
    url: "/taches",
    icon: ListTodo,
  },
  {
    title: "Sprints",
    url: "/sprints",
    icon: Activity,
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
  },
];

export function AppSidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const userInitial = user?.username ? user.username[0].toUpperCase() : "U";

  return (
    <aside className={cn("w-64 bg-white shadow-lg h-screen", className)}>
      <div className="flex h-full flex-col">
        <div className="p-4 border-b text-xl font-semibold mt-4">
          Dev DepannPC
        </div>

        <div className="p-4 mt-2">
          <Button
            className="w-full bg-black hover:bg-primary/90 text-white"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Créer un projet
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors relative group",
                pathname === item.url
                  ? "bg-gray-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  pathname === item.url
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-900"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  pathname === item.url
                    ? "text-white"
                    : "text-gray-700 group-hover:text-gray-900"
                )}
              >
                {item.title}
              </span>
              {pathname === item.url && (
                <span className="absolute inset-y-0 left-0 w-1 bg-white rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4 mt-auto">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">{userInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <CreateProjectDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </aside>
  );
}
