import { CreateWorkspaceForm } from "@/features/workspaces/components/CreateWorkspaceForm";

const WorkspaceCreatePage = async () => {
  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
