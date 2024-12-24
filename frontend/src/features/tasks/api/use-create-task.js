import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ form }) => {
      const response = await axiosInstance.post("/tasks", form);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Task created successfully");

      // Invalidate React Query cache for tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      toast.error(err.message); // Display error toast on failure
    },
  });

  return mutation;
};
