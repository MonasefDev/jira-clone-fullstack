"use client";

import { LoaderPage } from "@/components/LoaderPage";
import { useGetWorkspaceById } from "@/features/workspaces/api/use-get-workspace-by-id";
import { JoinWorkspaceForm } from "@/features/workspaces/components/JoinWorkspaceForm";
import { useParams } from "next/navigation";

const WorkspaceIdJoinPage = () => {
  const { workspaceId } = useParams();
  const { data: initialValues, isLoading } = useGetWorkspaceById({
    workspaceId,
  });

  if (isLoading) {
    return <LoaderPage />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm intialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
