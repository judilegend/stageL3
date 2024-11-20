import { Suspense } from "react";
import { ProjectList } from "@/components/projets/ProjectList";
import { ProjectsHeader } from "@/components/projets/ProjectsHeader";
import { Loader2 } from "lucide-react";

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
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
    </div>
  );
}
