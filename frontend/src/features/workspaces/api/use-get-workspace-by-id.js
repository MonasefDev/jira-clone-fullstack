import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useGetWorkspaceById = ({ workspaceId }) => {
  console.log("query key :", workspaceId);
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/workspaces/${workspaceId}`);

      if (!response.data) {
        throw new Error("Workspace not found.");
      }
      const { workspace } = response?.data;
      return workspace;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to get workspace");
    },
  });

  return query;
};
