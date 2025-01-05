'use server'

import axiosInstance from "@/lib/axiosInstance";

export async function createWorkspace(formData) {
  try {
    const response = await axiosInstance.post("/workspaces", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create workspace");
  }
}
