import { LoaderPage } from "@/components/LoaderPage";
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { EditTaskModal } from "@/features/tasks/components/EditTaskModal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";
import { Suspense } from "react";

function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<LoaderPage />}>
      <div className="min-h-screen">
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <CreateTaskModal />
        <EditTaskModal />
        <div className="flex w-full h-full">
          <div className="fixed bg-slate-600 top-0 left-0 lg:w-[264px] hidden lg:block h-full overflow-auto">
            <Sidebar />
          </div>
          <div className="lg:pl-[264px] w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Navbar />
              <main className="h-full py-8 px-6 flex flex-col">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Simple Navbar Component

export default DashboardLayout;
