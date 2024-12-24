// import { JoinWorkspaceForm } from "@/features/workspaces/components/JoinWorkspaceForm";
import { JoinWorkspaceForm } from "@/features/workspaces/components/JoinWorkspaceForm";
import { getWorkspaceById } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

const WorkspaceIdJoinPage = async ({ params }) => {
  const { workspaceId } = await params;
  console.log("workspaceId", workspaceId);
  const data = await getWorkspaceById({
    workspaceId,
  });
  console.log("data", data);
  if (!data) redirect("/");

  const initialValues = data;

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm intialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
