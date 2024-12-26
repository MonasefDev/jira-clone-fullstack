import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export const useGetTask = ({ taskId }) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tasks/${taskId}`);

      if (!response?.data) {
        throw new Error("Failed to get task");
      }

      return response?.data?.task; // Assuming `data` contains the task details
    },
  });

  return query;
};
