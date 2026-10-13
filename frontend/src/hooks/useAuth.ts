"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : `Login gagal (${response.status}).`;
        throw new Error(message);
      }

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
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function logout() {
    setLogoutError(null);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Logout gagal (${response.status}).`);
      }

      router.replace("/admin/login");
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Tidak dapat keluar. Silakan coba lagi.",
      );
    }
  }

  return { logout, logoutError };
}
