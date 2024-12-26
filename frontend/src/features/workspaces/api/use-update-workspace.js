import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ param, form }) => {
      const formData = new FormData();

      // Append form fields to FormData
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      // Send the request to the backend
      const response = await axiosInstance.patch(
        `workspaces/${param.workspaceId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      // Reset the form and redirect to the created workspace
      toast.success("Workspace updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["workspaces", data?.workspace?.id],
      });
    },

    onError: (error) => {
      // Display error notification
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update workspace. Try again."
      );
    },
  });

  return mutation;
};
