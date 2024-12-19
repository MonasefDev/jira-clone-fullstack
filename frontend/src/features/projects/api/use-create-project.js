import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateProject = () => {
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

      // Send the request to the backend
      const response = await axiosInstance.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
