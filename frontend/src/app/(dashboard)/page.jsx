import axiosInstanceServer from "@/lib/axiosInstanceServer";
import { HomeClient } from "./client";

export default async function Home() {
  const response = await axiosInstanceServer.get("/workspaces");
  const workspaces = response?.data?.workspaces || [];

  if (!workspaces) throw new Error("Workspaces not found.");

  return <HomeClient workspaces={workspaces} />;
}
