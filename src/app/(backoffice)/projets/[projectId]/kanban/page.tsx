import { Suspense } from "react";
import { WorkPackageList } from "@/components/backlog/WorkPackageList";
import { getWorkPackagesByProjectId } from "@/services/workpackage-service";

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function BacklogPage({ params }: PageProps) {
  const projectId = params.projectId;
  const workPackages = await getWorkPackagesByProjectId(projectId);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-8">
          <Suspense fallback={<div>Chargement des work packages...</div>}>
            <WorkPackageList
              projectId={projectId}
              initialWorkPackages={workPackages}
              initialActivities={[]}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
