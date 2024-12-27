import { EditProjectForm } from "@/features/projects/components/EditProjectForm";
import { getProjectById } from "@/features/projects/queries";

const ProjectIdSettingsPage = async ({ params }) => {
  const { projectId } = await params;
  const initialValues = await getProjectById({
    projectId,
  });

  if (!initialValues) throw new Error("Project not found");

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
