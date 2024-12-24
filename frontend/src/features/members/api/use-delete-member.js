import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await axiosInstance.delete(`/members/${param.memberId}`);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete member");
    },
  });
  return mutation;
};
