import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useJoinWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ workspaceId, inviteCode }) => {
      // Send the request to the backend
      const response = await axiosInstance.post(
        `workspaces/${workspaceId}/join`,
        { inviteCode }
      );

      if (!response.data) {
        throw new Error("Failed to join workspace. Try again.");
      }

      return response?.data?.workspace;
    },

    onSuccess: (data) => {
      // Reset the form and redirect to the created workspace
      toast.success("Workspace joined successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", data?.workspace?.id],
      });
    },

    onError: (error) => {
      // Display error notification
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to join workspace. Try again."
      );
    },
  });

  return mutation;
};
