"use client";

import { useState } from "react";
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
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <SprintFilters />

        <Tabs defaultValue="active" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="planned">Planned</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="planned" className="mt-4">
            <SprintList filter="planned" />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <SprintList filter="in_progress" />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <SprintList filter="completed" />
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
