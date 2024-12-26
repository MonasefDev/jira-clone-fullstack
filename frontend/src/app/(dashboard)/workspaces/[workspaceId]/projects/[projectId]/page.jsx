import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { getProjectById } from "@/features/projects/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";

const ProjectIdPage = async ({ params }) => {
  const { projectId } = await params;

  const initialValues = await getProjectById({ projectId });

  if (!initialValues) {
    throw new Error("Project not found");
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            image={initialValues?.imageUrl}
            name={initialValues?.name}
          />
          <p className="text-lg font-semibold">{initialValues?.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.id}/settings`}
            >
              <Pencil1Icon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
};

export default ProjectIdPage;
