"use client";

import { LoaderPage } from "@/components/LoaderPage";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { EditWorkspaceForm } from "@/features/workspaces/components/EditWorkSpaceForm";
import { useParams } from "next/navigation";

const WorkspaceIdSettingPage = () => {
  const { workspaceId } = useParams();
  const { data: workspace, isLoading } = useGetWorkspaceById({ workspaceId });

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className="w-full lg:max-w-3xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdSettingPage;
