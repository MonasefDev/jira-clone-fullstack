import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await axiosInstance.get("/workspaces");

      if (!response.data) {
        throw new Error("Workspaces not found.");
      }
      const { workspaces } = response.data;
      return workspaces;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return query;
};
