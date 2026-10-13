/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLogin } from "@/hooks/useAuth";
import { SunIcon, MoonIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

export default function LoginPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        disabled={!mounted}
        aria-label={
          resolvedTheme === "dark"
            ? "Aktifkan mode terang"
            : "Aktifkan mode gelap"
        }
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 text-primary transition hover:bg-primary/10 disabled:cursor-default"
      >
        {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Card */}
      <section
        aria-labelledby="login-title"
        className="relative w-full max-w-md rounded-2xl border border-primary/10 p-7 shadow-xl shadow-primary/5 sm:p-10"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/himatif-logo.png"
            alt="Logo HIMATIF UNINUS"
            width={96}
            height={96}
            priority
            className="mb-5 h-24 w-24 object-contain"
          />
          <h1
            id="login-title"
            className="text-2xl font-bold"
            style={{ color: "var(--text-body)" }}
          >
            Masuk Admin
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Masuk untuk mengelola konten website.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "var(--text-body)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="nama@email.com"
              {...register("email")}
              className="h-12 w-full rounded-lg border px-4 text-sm outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-primary/10"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-body)",
                borderColor: errors.email ? "#ef4444" : "rgba(18,64,118,0.15)",
              }}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "var(--text-body)" }}
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                {...register("password")}
                className="h-12 w-full rounded-lg border px-4 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-primary/10"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-body)",
                  borderColor: errors.password
                    ? "#ef4444"
                    : "rgba(18,64,118,0.15)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
                className="absolute inset-y-0 right-3 flex items-center text-primary hover:opacity-75"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Root Error */}
          {errors.root && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
            >
              {errors.root.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p
          className="mt-8 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Area khusus pengelola HIMATIF UNINUS
        </p>
      </section>
    </main>
  );
}
