import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createWorkspace } from "./actions";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ form }) => {
      const formData = new FormData();

      // Append form fields to FormData
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      // Call the server action
      return await createWorkspace(formData);
    },

    onSuccess: (data) => {
      // Reset the form and redirect to the created workspace
      toast.success("Workspace created successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },

    onError: (error) => {
      // Display error notification
      console.error(error);
      toast.error(error.message || "Failed to create workspace. Try again.");
    },
  });

  return mutation;
};
