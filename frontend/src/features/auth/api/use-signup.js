import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/sign-up`, data);

      return response.data;
    },
    onSuccess: (response) => {
      const {
        token,
        data: { user },
      } = response;

      // Store the token in cookies
      Cookies.set("jira-token", token, {
        expires: 7, // Token will expire in 7 days
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Protect against CSRF
      });

      // Display a welcome message
      toast.success(`Welcome, ${user.name}! You are registered.`);

      // Redirect to the dashboard
      router.push("/");

      // Redirect to the dashboard
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to sign up");
    },
  });
  return mutation;
};
