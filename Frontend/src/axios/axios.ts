import axios from "axios";
import { Store } from "../store/Store";
import { clearAccessToken, setAccessToken } from "../store/tokenSlice";
import { clearAuth } from "../store/authSlice";

export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const state = Store.getState();
    const token = state.token?.accessToken;
    console.log("Access token from store:", token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    console.log(error)
    if (status === 401 && !originalRequest._retry && error.response.data.error === "Unauthorized") {
      originalRequest._retry = true;
      try {
        const res = await AxiosInstance.post(`${import.meta.env.VITE_API_URL}/auth/refresh`);
        const newAccessToken = res.data.data.accessToken;

        Store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        Store.dispatch(clearAccessToken());
        Store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
