"use client";

import axios, { AxiosError } from "axios";

export const useLogin = async (password: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${backendUrl}/auth`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-auth-password": password,
      },
      withCredentials: true,
    });

    localStorage.setItem("admin-password", password);

    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
};
