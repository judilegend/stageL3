"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/taches/TaskCard";

const columns = {
  todo: { title: "À faire", color: "border-blue-500" },
  in_progress: { title: "En cours", color: "border-yellow-500" },
  review: { title: "En révision", color: "border-purple-500" },
  done: { title: "Terminé", color: "border-green-500" },
};

export function KanbanBoard({ tasks, onUpdateTask }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      onUpdateTask(Number(draggableId), { status: destination.droppableId });
    }
  };

  const organizedTasks = Object.keys(columns).reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(columns).map(([status, { title, color }]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-white rounded-lg shadow p-4 border-t-4 ${color}`}
              >
                <h3 className="font-semibold mb-4">{title}</h3>
                <div className="space-y-3">
                  {organizedTasks[status].map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
