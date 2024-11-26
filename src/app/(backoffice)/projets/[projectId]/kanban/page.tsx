import { Suspense } from "react";
import { WorkPackageList } from "@/components/kanban/WorkPackageList";
import { getWorkPackagesByProjectId } from "@/services/workpackage-service";

interface PageProps {
  params: {
    projectId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function KanbanPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-8">
          <Suspense fallback={<div>Chargement des work packages...</div>}>
            <WorkPackageList projectId={projectId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;

  return {
    title: `Kanban - Projet ${resolvedParams.projectId}`,
    description: "Tableau Kanban du projet",
  };
}
