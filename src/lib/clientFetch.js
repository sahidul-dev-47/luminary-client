"use client";
import { authClient } from "@/lib/auth-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getAuthHeader = async () => {
  const session = await authClient.getSession();
  const token = session?.data?.session?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authFetch = async (path, options = {}) => {
  const headers = await getAuthHeader();
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
      ...(options.headers || {}),
    },
  });
  return res;
};