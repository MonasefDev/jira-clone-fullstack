import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ form, param }) => {
      const formData = new FormData();
      const { projectId } = param;

      // Append form fields to FormData
      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      // Send the request to the backend
      const response = await axiosInstance.patch(
        `/projects/${projectId}`,
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
      toast.success("Project updated successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
