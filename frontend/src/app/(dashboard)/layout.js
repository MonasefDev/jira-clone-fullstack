// React and Next.js imports
import PropTypes from 'prop-types';
import { Suspense } from "react";

// Layout Components
import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

// Feature Modals
import { LoaderPage } from "@/components/LoaderPage";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { CreateTaskModal } from "@/features/tasks/components/CreateTaskModal";
import { EditTaskModal } from "@/features/tasks/components/EditTaskModal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";

/**
 * DashboardLayout - Main layout component for the dashboard area
 * Provides the structure for the dashboard including sidebar, navbar and modal components
 */
function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<LoaderPage />}>
      <div className="min-h-screen">
        {/* Global Modals */}
        <CreateWorkspaceModal />
        <CreateProjectModal />
        <CreateTaskModal />
        <EditTaskModal />
        
        <div className="flex w-full h-full">
          {/* Sidebar */}
          <div className="fixed bg-slate-600 top-0 left-0 lg:w-[264px] hidden lg:block h-full overflow-auto">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:pl-[264px] w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              <Navbar />
              <main className="h-full mx-auto py-8 px-6 flex flex-col">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
