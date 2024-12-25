import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await axiosInstance.delete(`/tasks/${param.taskId}`);

      if (!response?.data) {
        throw new Error("Failed to delete task");
      }

      return response.data; // Return the `data` field containing the deleted task info
    },
    onSuccess: (data) => {
      toast.success("Task deleted successfully");

      // Invalidate React Query caches to refresh tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete task"); // Display error toast on failure
    },
  });

  return mutation;
};
