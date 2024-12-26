import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useDeleteWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await axiosInstance.delete(
        `/workspaces/${param.workspaceId}`
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push("/");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete workspace"
      );
    },
  });
  return mutation;
};
