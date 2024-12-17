import axiosInstanceServer from "@/lib/axiosInstanceServer";
import { HomeClient } from "./client";
import { Suspense } from "react";
import DashboardLoading from "./loading";

export default async function Home() {
  const response = await axiosInstanceServer.get("/workspaces");
  const workspaces = response?.data?.workspaces || [];

  if (!workspaces) throw new Error("Workspaces not found.");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <HomeClient workspaces={workspaces} />
    </Suspense>
  );
}
