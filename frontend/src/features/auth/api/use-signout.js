import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Send logout request to the server
      await axiosInstance.post("/auth/sign-out");
    },
    onSuccess: () => {
      // Remove the token from cookies
      Cookies.remove("jira-token");

      // Invalidate any queries
      queryClient.invalidateQueries();

      // Notify the user
      toast.success("Logged out successfully!");

      // Redirect to the sign-in page
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to log out. Please try again."
      );
    },
  });
};
