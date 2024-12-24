import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useResetInviteCode = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const { workspaceId } = param;
      const response = await axiosInstance.patch(
        `workspaces/${workspaceId}/reset-invite-code`
      );

      return response.data;
    },

    onSuccess: (data) => {
      console.log("data", data);
      // Reset the form and redirect to the created workspace
      toast.success("Invite code reset successfully!");
      router.refresh();
    },

    onError: (error) => {
      // Display error notification
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset invit code. Try again."
      );
    },
  });

  return mutation;
};
