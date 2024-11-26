import { Suspense } from "react";
import { ProjectList } from "@/components/projets/ProjectList";
import { ProjectsHeader } from "@/components/projets/ProjectsHeader";
import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

async function getProjects() {
  const res = await fetch("http://localhost:5000/api/projects", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export default async function ProjectsPage() {
  const initialProjects = await getProjects();

  return (
    <div className="w-full py-4 sm:py-6 lg:py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectsHeader />
        <Suspense
          fallback={
            <div className="w-full h-[50vh] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <ProjectList initialProjects={initialProjects} />
        </Suspense>
      </Suspense>
    </div>
  );
}
