import { NextResponse } from "next/server";

const TOKEN_COOKIE = "admin_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL belum dikonfigurasi." },
      { status: 500 },
    );
  }

  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan login tidak valid." },
      { status: 400 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Tidak dapat terhubung ke server autentikasi." },
      { status: 502 },
    );
  }

  const payload: unknown = await backendResponse.json().catch(() => null);
  if (!backendResponse.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : `Login gagal (${backendResponse.status}).`;

    return NextResponse.json(
      { error: message },
      { status: backendResponse.status },
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("token" in payload) ||
    typeof payload.token !== "string" ||
    payload.token.length === 0
  ) {
    return NextResponse.json(
      { error: "Server autentikasi mengembalikan respons yang tidak valid." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ message: "Login berhasil." });
  response.cookies.set(TOKEN_COOKIE, payload.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}
