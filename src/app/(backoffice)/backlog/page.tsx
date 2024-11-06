// app/projects/[projectId]/kanban/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, GripVertical } from "lucide-react";
import { TaskMatrix } from "@/components/taches/TaskMatrix";

// Types
interface KanbanItem {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
}

interface Column {
  id: string;
  title: string;
  items: KanbanItem[];
}

export default function KanbanBoard() {
  const params = useParams();
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "backlog",
      title: "Backlog",
      items: [
        {
          id: "1",
          title: "Analyse des besoins",
          description: "Définir les spécifications du projet",
          status: "backlog",
          priority: "high",
        },
        {
          id: "2",
          title: "Design UI/UX",
          description: "Créer les maquettes",
          status: "backlog",
          priority: "medium",
        },
      ],
    },
    {
      id: "in_progress",
      title: "En cours",
      items: [
        {
          id: "3",
          title: "Développement Frontend",
          description: "Implémenter l'interface utilisateur",
          status: "in_progress",
          priority: "high",
          assignedTo: "John Doe",
        },
      ],
    },
    {
      id: "review",
      title: "En révision",
      items: [],
    },
    {
      id: "done",
      title: "Terminé",
      items: [
        {
          id: "4",
          title: "Configuration du projet",
          description: "Initialisation de l'environnement",
          status: "done",
          priority: "low",
        },
      ],
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1370px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${params?.projectId}`}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tableau Kanban</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-8">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">{column.title}</h2>
                <Badge variant="secondary">{column.items.length}</Badge>
              </div>

              <div className="space-y-3">
                {column.items.map((item) => (
                  <Card key={item.id} className="bg-white shadow-sm">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <button className="text-gray-400 hover:text-gray-600">
                          <GripVertical className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      {item.assignedTo && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            {item.assignedTo[0]}
                          </div>
                          <span>{item.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une carte
                </Button>
              </div>
            </div>
          ))}

          <div className="flex-shrink-0 w-80">
            <Button
              variant="ghost"
              className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une colonne
            </Button>
          </div>
        </div>
        {/* Add TaskMatrix below the Kanban board */}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Matrice des Tâches
          </h2>
          <TaskMatrix />
        </div>
      </div>
    </div>
  );
}
