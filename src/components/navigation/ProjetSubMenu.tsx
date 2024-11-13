import { useRouter } from "next/navigation";
import {
  Activity,
  Archive,
  ChevronDown,
  ChevronRight,
  Layout,
  ListTodo,
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string | number;
  title: string;
}

interface ProjectSubmenuProps {
  project: Project;
  onProjectSelect: (id: string) => void;
  closeMenu: () => void;
}

const ProjectSubmenu = ({
  project,
  onProjectSelect,
  closeMenu,
}: ProjectSubmenuProps) => {
  const router = useRouter();

  const handleSubmenuClick = () => {
    onProjectSelect(project.id.toString());
    closeMenu();
  };

  const menuItems = [
    {
      href: `/projets/${project.id}/kanban`,
      icon: Layout,
      label: "Kanban",
    },
    {
      href: `/projets/${project.id}/backlog`,
      icon: Archive,
      label: "Product Backlog",
    },
    {
      href: `/projets/${project.id}/taches`,
      icon: ListTodo,
      label: "Gestion des tâches",
    },
    {
      href: `/projets/${project.id}/sprints`,
      icon: Activity,
      label: "Sprints",
    },
  ];

  return (
    <div className="group relative">
      <button
        onClick={handleSubmenuClick}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
      >
        <span>{project.title}</span>
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </button>

      <div className="hidden group-hover:block absolute left-full top-0 w-48 bg-white rounded-lg shadow-lg">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} onClick={closeMenu}>
            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectSubmenu;
