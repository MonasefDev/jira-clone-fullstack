import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetProjects = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/projects?workspaceId=${workspaceId}`
      );

      if (!response.data) {
        throw new Error("Projects not found.");
      }

      return response?.data?.projects;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return query;
};
