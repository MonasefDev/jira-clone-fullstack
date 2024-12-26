import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ form, param }) => {
      const response = await axiosInstance.patch(
        `/tasks/${param.taskId}`,
        form
      );

      return response?.data?.task; // Return the `data` field containing updated task info
    },
    onSuccess: (data) => {
      toast.success("Task updated successfully");

      // Refresh router and navigate to the task page
      router.refresh();
      // router.push(`/workspaces/${data?.workspaceId}/tasks/${data?.id}`);

      // Invalidate React Query caches for tasks
      queryClient.invalidateQueries({ queryKey: ["task", data?.id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update task"); // Display error toast on failure
    },
  });

  return mutation;
};
