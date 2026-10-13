"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAPI } from "@/lib/api";
import {
  loginSchema,
  type LoginFormData,
  type LoginResponse,
} from "@/schemas/authSchema";

function saveToken(token: string) {
  document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 24}`;
  localStorage.setItem("admin_token", token);
}

function clearToken() {
  document.cookie = "admin_token=; path=/; max-age=0";
  localStorage.removeItem("admin_token");
}

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function useLogin() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect kalau sudah login
  useEffect(() => {
    const token = getToken();
    if (token) router.replace("/admin/dashboard");
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetchAPI<LoginResponse>("/api/v1/auth/login", {
        method: "POST",
        body: data,
      });

      saveToken(response.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "Tidak dapat masuk. Silakan coba lagi.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}

export function useLogout() {
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  return { logout };
}
