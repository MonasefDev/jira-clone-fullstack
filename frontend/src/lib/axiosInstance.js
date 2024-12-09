import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Base URL for your backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
