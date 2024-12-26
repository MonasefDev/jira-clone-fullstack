"use client";

import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

import { useGetProjectById } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";
import { LoaderPage } from "@/components/LoaderPage";
import { Analytics } from "@/components/Analytics";
import { useParams } from "next/navigation";

const ProjectIdPage = () => {
  const { projectId } = useParams();
  const { data: initialValues, isLoading: isInitialLoading } =
    useGetProjectById({ projectId });
  const { data: anaylics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });
  const isLoading = isInitialLoading || isAnalyticsLoading;

  if (isLoading) {
    return <LoaderPage />;
  }

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
      {anaylics ? <Analytics data={anaylics} /> : null}
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
};

export default ProjectIdPage;
