import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await axiosInstance.get("auth/current-user");
      return response?.data?.user;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Disable retries if the request fails
  });

  return query;
};
