import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/sign-in`, data);

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
      toast.success(`Welcome, ${user.name}! You are signed in.`);

      // Redirect to the dashboard
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
