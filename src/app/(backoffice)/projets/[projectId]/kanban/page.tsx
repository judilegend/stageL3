import { Suspense } from "react";
import { WorkPackageList } from "@/components/backlog/WorkPackageList";
import { TaskMatrix } from "@/components/taches/TaskMatrix";
import { getWorkPackagesByProjectId } from "@/services/workpackage-service";

interface PageProps {
  params: {
    projectId: string;
  };
}

export default function BacklogPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1370px] mx-auto">
        <div className="space-y-8">
          <Suspense fallback={<div>Chargement des work packages...</div>}>
            <WorkPackageList projectId={params.projectId} />
          </Suspense>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Matrice des Tâches
            </h2>
            <Suspense fallback={<div>Chargement de la matrice...</div>}>
              <TaskMatrix />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
