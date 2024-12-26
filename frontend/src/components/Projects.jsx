"use client";

import { useParams, usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import Link from "next/link";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Loader } from "lucide-react";

const Projects = () => {
  const { workspaceId } = useParams();
  const pathname = usePathname();

  const { open } = useCreateProjectModal();
  const { data: projects, isLoading } = useGetProjects({
    workspaceId,
    enabled: !!workspaceId, // Only fetch projects if workspaceId is defined
  });

  if (!workspaceId)
    return <div className="text-neutral-500 py-1 px-2">No projects found</div>;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 uppercase">
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {isLoading ? (
        <div className="w-full py-4 flex justify-center items-center relative">
          <Loader className="animate-spin size-6 text-muted-foreground" />
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-neutral-500 py-1 px-2">No projects found</div>
      ) : (
        projects?.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.id}?projectId=${project.id}`;
          const isActive =
            pathname === `/workspaces/${workspaceId}/projects/${project.id}`;

          return (
            <Link href={href} key={project.id}>
              <div
                className={cn(
                  "flex items-center bg:transparent hover:bg-neutral-200 hover:text-neutral-700 gap-2.5 p-2.5 rounded-md font-medium hover:opacity-75 transition cursor-pointer text-neutral-500",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <ProjectAvatar image={project.imageUrl} name={project.name} />
                <span className="truncate hover:text-primary text-neutral-500 text-sm transition">
                  {project.name}
                </span>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Projects;
