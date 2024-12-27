import { LoaderPage } from "@/components/LoaderPage";
import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";
import { Suspense } from "react";

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col">
      <Suspense fallback={<LoaderPage />}>
        <TaskViewSwitcher />{" "}
      </Suspense>
    </div>
  );
}
