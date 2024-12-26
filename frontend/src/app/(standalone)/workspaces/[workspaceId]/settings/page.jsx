// import { EditWorkspaceForm } from "@/features/workspaces/components/EditWorkSpaceForm";
// import { getWorkspaceById } from "@/features/workspaces/queries";
// import { redirect } from "next/navigation";
import { Suspense } from "react";
import ServerPage from "./ServerPage";
import { LoaderPage } from "@/components/LoaderPage";

const WorkspaceIdSettingPage = async ({ params }) => {
  const { workspaceId } = await params;
  return (
    <Suspense fallback={<LoaderPage />}>
      <ServerPage workspaceId={workspaceId} />
    </Suspense>
  );
};

export default WorkspaceIdSettingPage;
