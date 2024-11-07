"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { useTasks } from "@/contexts/TaskContext";
import { Task } from "@/types/task";

interface CategorizedTasks {
  importantUrgent: Task[];
  importantNotUrgent: Task[];
  notImportantUrgent: Task[];
  notImportantNotUrgent: Task[];
}

export function TaskMatrix() {
  const { state } = useTasks();
  const allTasks = Object.values(state.tasksByActivity).flat();

  const categorizedTasks: CategorizedTasks = {
    importantUrgent: allTasks.filter(
      (task) => task.importance === "important" && task.urgency === "urgent"
    ),
    importantNotUrgent: allTasks.filter(
      (task) => task.importance === "important" && task.urgency === "not-urgent"
    ),
    notImportantUrgent: allTasks.filter(
      (task) => task.importance === "not-important" && task.urgency === "urgent"
    ),
    notImportantNotUrgent: allTasks.filter(
      (task) =>
        task.importance === "not-important" && task.urgency === "not-urgent"
    ),
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-700">
            Important & Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.importantUrgent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {categorizedTasks.importantUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yellow-700">
            Important & Non Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.importantNotUrgent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {categorizedTasks.importantNotUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-orange-700">
            Non Important & Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.notImportantUrgent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {categorizedTasks.notImportantUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-700">
            Non Important & Non Urgent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categorizedTasks.notImportantNotUrgent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {categorizedTasks.notImportantNotUrgent.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Aucune tâche dans cette catégorie
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
