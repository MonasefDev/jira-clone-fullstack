import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useGetWorkspaceById = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/workspaces/?workspaceId=${workspaceId}`
      );

      if (!response.data) {
        throw new Error("Workspace not found.");
      }
      const { workspace } = response.data;
      return workspace;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return query;
};
