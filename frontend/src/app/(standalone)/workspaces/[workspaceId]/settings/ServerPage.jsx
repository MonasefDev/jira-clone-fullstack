import { EditWorkspaceForm } from "@/features/workspaces/components/EditWorkSpaceForm";
import { getWorkspaceById } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

const ServerPage = async ({ workspaceId }) => {
  const workspace = await getWorkspaceById({ workspaceId });
  if (!workspace) redirect(`workspaces/${workspaceId}`);

  return (
    <div className="w-full lg:max-w-3xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default ServerPage;
