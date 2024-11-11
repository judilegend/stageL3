"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SprintProvider } from "@/contexts/SprintContext";
import { SprintList } from "@/components/sprints/SprintList";
import { CreateSprintDialog } from "@/components/sprints/CreateSprintDialog";
import { SprintFilters } from "@/components/sprints/SprintFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectSprintsPage() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const projectId = params?.projectId as string;

  return (
    <SprintProvider>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Project Sprints</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <SprintFilters projectId={parseInt(projectId)} />

        <Tabs defaultValue="active" className="mt-6">
          <TabsList>
            <TabsTrigger value="planned">Planned Sprints</TabsTrigger>
            <TabsTrigger value="active">Active Sprints</TabsTrigger>
            <TabsTrigger value="completed">Completed Sprints</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <SprintList filter="in_progress" projectId={parseInt(projectId)} />
          </TabsContent>
          <TabsContent value="completed">
            <SprintList filter="completed" projectId={parseInt(projectId)} />
          </TabsContent>
          <TabsContent value="planned">
            <SprintList filter="planned" projectId={parseInt(projectId)} />
          </TabsContent>
        </Tabs>

        <CreateSprintDialog
          open={open}
          onOpenChange={setOpen}
          projectId={parseInt(projectId)}
        />
      </div>
    </SprintProvider>
  );
}
