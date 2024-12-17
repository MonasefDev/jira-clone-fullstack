import axios from "axios";
import { cookies } from "next/headers";

const axiosInstanceServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Base URL for your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
axiosInstanceServer.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies(); // Must be awaited dynamically
    const token = cookieStore.get("jira-token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstanceServer;
