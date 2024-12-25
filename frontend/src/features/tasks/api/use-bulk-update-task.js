import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tasks: data }) => {
      const response = await axiosInstance.patch("/tasks/bulk-update", {
        tasks: data,
      });

      console.log(response);

      if (!response?.data) {
        throw new Error("Failed to update tasks");
      }
      const { tasks } = response?.data;
      return tasks; // Return the updated task data
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
