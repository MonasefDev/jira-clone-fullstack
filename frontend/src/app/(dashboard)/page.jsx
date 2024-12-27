"use client";

import { LoaderPage } from "@/components/LoaderPage";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { redirect } from "next/navigation";

const DEFAULT_REDIRECT = "/workspaces/create";

export default function Home() {
  const { data: workspaces, isLoading } = useGetWorkspaces();

  if (isLoading) {
    return <LoaderPage />;
  }

  const hasWorkspaces = workspaces?.length > 0;

  if (!hasWorkspaces) {
    redirect(DEFAULT_REDIRECT);
  }

  const firstWorkspaceId = workspaces[0].id;
  redirect(`/workspaces/${firstWorkspaceId}`);
}
