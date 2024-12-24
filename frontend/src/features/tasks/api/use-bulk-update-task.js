import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ json }) => {
      const response = await axiosInstance.post("/tasks/bulk-update", json);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to update tasks");
      }

      return response.data.data; // Return the updated task data
    },
    onSuccess: (data) => {
      // Invalidate tasks cache to ensure updated tasks are reflected in the UI
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tasks updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update tasks");
    },
  });

  return mutation;
};
