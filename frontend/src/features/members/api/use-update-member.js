import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param, json }) => {
      const response = await axiosInstance.patch(
        `/members/${param.memberId}`,
        json
      );

      if (!response.data) {
        throw new Error("Failed to update member");
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update member");
    },
  });
  return mutation;
};
