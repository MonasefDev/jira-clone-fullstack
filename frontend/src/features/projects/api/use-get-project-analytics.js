import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetProjectAnalytics = ({ projectId }) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/projects/${projectId}/analytics`
      );

      if (!response.data) {
        throw new Error("Project analytics not found.");
      }
      return response?.data?.data;
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to get project analytics"
      );
    },
  });

  return query;
};
