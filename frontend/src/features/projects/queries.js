import axiosInstanceServer from "@/lib/axiosInstanceServer";

export const getProjectById = async ({ projectId }) => {
  try {
    const response = await axiosInstanceServer.get(`/projects/${projectId}`);

    if (!response.data) {
      throw new Error("project not found.");
    }
    const { project } = response.data;
    return project;
  } catch (err) {
    console.error(err);
  }
};
