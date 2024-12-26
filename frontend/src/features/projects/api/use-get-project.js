import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetProjectById = ({ projectId }) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/projects/${projectId}`);

      if (!response.data) {
        throw new Error("project not found.");
      }

      return response?.data?.project;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return query;
};
