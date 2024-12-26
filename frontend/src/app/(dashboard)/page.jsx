"use client";

import { LoaderPage } from "@/components/LoaderPage";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: workspaces, isLoading } = useGetWorkspaces();

  if (isLoading) {
    return <LoaderPage />;
  }

  if (workspaces?.length === 0) {
    redirect("/workspaces/create");
  }
  redirect(`/workspaces/${workspaces[0].id}`);
}
