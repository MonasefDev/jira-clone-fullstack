import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await axiosInstance.delete(
        `/projects/${param.projectId}`
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects", data?.workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
