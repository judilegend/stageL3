"use client";

import { useState } from "react";
import { SprintProvider } from "@/contexts/SprintContext";
import { SprintList } from "@/components/sprints/SprintList";
import { CreateSprintDialog } from "@/components/sprints/CreateSprintDialog";
import { SprintFilters } from "@/components/sprints/SprintFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SprintsPage() {
  const [open, setOpen] = useState(false);

  return (
    <SprintProvider>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sprint Management</h1>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <SprintFilters />

        <Tabs defaultValue="active" className="mt-6">
          <TabsList>
            <TabsTrigger value="active">Active Sprints</TabsTrigger>
            <TabsTrigger value="completed">Completed Sprints</TabsTrigger>
            <TabsTrigger value="planned">Planned Sprints</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <SprintList filter="in_progress" />
          </TabsContent>
          <TabsContent value="completed">
            <SprintList filter="completed" />
          </TabsContent>
          <TabsContent value="planned">
            <SprintList filter="planned" />
          </TabsContent>
        </Tabs>

        <CreateSprintDialog open={open} onOpenChange={setOpen} />
      </div>
    </SprintProvider>
  );
}
