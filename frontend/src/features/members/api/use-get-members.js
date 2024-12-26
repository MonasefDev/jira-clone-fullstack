import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/members?workspaceId=${workspaceId}`
      );

      // if (!response.data.success) {
      //   throw new Error("Failed to get members");
      // }

      return response.data.members;
    },
    onError: (error) => {
      console.error("Error fetching members:", error.message);
    },
  });

  return query;
};
