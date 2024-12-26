import { LoaderPage } from "@/components/LoaderPage";
import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";
import { Suspense } from "react";

export default function TasksPage() {
  return (
    <Suspense fallback={<LoaderPage />}>
      <div className="h-full flex flex-col">
        <TaskViewSwitcher />
      </div>
    </Suspense>
  );
}
