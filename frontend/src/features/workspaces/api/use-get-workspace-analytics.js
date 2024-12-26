import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useGetWorkspaceAnalytics = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/workspaces/${workspaceId}/analytics`
      );

      if (!response.data) {
        throw new Error("Workspace analytics not found.");
      }
      return response?.data?.data;
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to get workspace analytics"
      );
    },
  });

  return query;
};
