import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
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
  );
}

// Simple Navbar Component

export default DashboardLayout;
