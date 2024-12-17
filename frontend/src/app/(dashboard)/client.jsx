"use client";

import { redirect } from "next/navigation";

export const HomeClient = ({ workspaces = [] }) => {
  if (workspaces.length === 0) {
    redirect("/workspaces/create");
  }
  redirect(`/workspaces/${workspaces[0].id}`);
};
