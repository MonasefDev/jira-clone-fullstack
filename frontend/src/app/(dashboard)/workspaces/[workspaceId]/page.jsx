"use client";

import { useParams } from "next/navigation";

import { ErrorPage } from "@/components/ErrorPage";
import { LoaderPage } from "@/components/LoaderPage";

import { Analytics } from "@/components/Analytics";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/MemberAvatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { Settings } from "lucide-react";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { TaskList } from "@/components/TaskList";
import { ProjectList } from "@/components/ProjectList";
import { MemberList } from "@/components/MemberList";

const WorkspaceIdPage = () => {
  const { workspaceId } = useParams();
  const { data: analytics, isPending: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: projects, isFetching: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: tasks, isFetching: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: members, isFetching: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingProjects ||
    isLoadingTasks ||
    isLoadingMembers;

  if (isLoading) return <LoaderPage />;

  if (!analytics || !projects || !tasks || !members) {
    return <ErrorPage message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks} total={tasks.length} />
        <ProjectList data={projects} total={projects.length} />
        <MemberList data={members} total={members.length} />
      </div>
    </div>
  );
};

export default WorkspaceIdPage;
