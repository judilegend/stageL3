import { useSprints } from "@/contexts/SprintContext";
import { SprintCard } from "./SprintCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SprintList({ filter }: { filter: string }) {
  const { sprints, loading } = useSprints();

  const filteredSprints = sprints.filter((sprint) => sprint.status === filter);

  if (loading) return <div>Loading...</div>;

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSprints.map((sprint) => (
          <SprintCard key={sprint.id} sprint={sprint} />
        ))}
      </div>
    </ScrollArea>
  );
}
