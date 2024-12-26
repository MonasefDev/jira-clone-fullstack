import axiosInstanceServer from "@/lib/axiosInstanceServer";
import toast from "react-hot-toast";

export const getWorkspaceById = async ({ workspaceId }) => {
  try {
    const response = await axiosInstanceServer.get(
      `/workspaces/${workspaceId}`
    );

    if (!response.data) {
      throw new Error("Workspace not found.");
    }
    const { workspace } = response.data;
    return workspace;
  } catch (err) {
    console.error(err);
  }
};
