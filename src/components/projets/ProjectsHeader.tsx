"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateProjectDialog from "./CreateProjectDialog";

export function ProjectsHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos projets et suivez leur progression
        </p>
      </div>

      {/* <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-black hover:bg-gray-800"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Créer un projet
      </Button> */}
      {/* 
      <CreateProjectDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
    </div>
  );
}
