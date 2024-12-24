import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetTasks = ({
  workspaceId,
  projectId,
  assigneeId,
  status,
  dueDate,
  search,
}) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assigneeId,
      status,
      dueDate,
      search,
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/tasks", {
          params: {
            workspaceId,
            projectId: projectId ?? undefined,
            assigneeId: assigneeId ?? undefined,
            status: status ?? undefined,
            dueDate: dueDate ?? undefined,
            search: search ?? undefined,
          },
        });

        return response?.data?.tasks;
      } catch (err) {
        throw new Error(err?.response?.data?.message || "Failed to get tasks");
      }
    },
    onError: (err) => {
      toast.error(err.message); // Display error toast if query fails
    },
  });

  return query;
};
