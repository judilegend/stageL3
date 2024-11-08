import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSprints } from "@/contexts/SprintContext";

interface AddTasksToSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprintId: number;
}

export function AddTasksToSprintDialog({
  open,
  onOpenChange,
  sprintId,
}: AddTasksToSprintDialogProps) {
  const { state } = useTasks();
  const { addTaskToSprint } = useSprints();
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const availableTasks = Object.values(state.tasksByActivity)
    .flat()
    .filter((task) => !task.sprintId);

  const handleSubmit = async () => {
    for (const taskId of selectedTasks) {
      await addTaskToSprint(sprintId, taskId);
    }
    setSelectedTasks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Tasks to Sprint</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {availableTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTasks([...selectedTasks, task.id]);
                    } else {
                      setSelectedTasks(
                        selectedTasks.filter((id) => id !== task.id)
                      );
                    }
                  }}
                />
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedTasks.length === 0}>
            Add Selected Tasks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
