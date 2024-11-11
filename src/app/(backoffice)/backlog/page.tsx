"use client";
import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/backlog/KanbanBoard";
import { useTasks } from "@/contexts/TaskContext";
import { TaskMatrix } from "@/components/taches/TaskMatrix";

export default function BacklogPage() {
  const { state, updateTask } = useTasks();
  const allTasks = Object.values(state.tasksByActivity).flat();

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backlog</h1>
      </div>

      <KanbanBoard tasks={allTasks} onUpdateTask={updateTask} />

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Matrice des Tâches</h2>
        <TaskMatrix />
      </div>
    </div>
  );
}
