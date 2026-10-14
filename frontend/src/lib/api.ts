const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type FetchOptions = {
  method?: HttpMethod;
  body?: unknown;
};

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;

  const isAdminRequest = endpoint.startsWith("/api/admin/");
  if (!isAdminRequest && !BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  const headers = new Headers();
  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = typeof body === "string" ? body : JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(isAdminRequest ? endpoint : `${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: requestBody,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server. Periksa koneksi dan pastikan layanan sedang berjalan.",
      );
    }
    throw error;
  }

  if (!res.ok) {
    const error: unknown = await res.json().catch(() => null);
    const message =
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      typeof error.error === "string"
        ? error.error
        : `Permintaan gagal (${res.status}).`;
    throw new Error(message);
  }

  return res.json();
}
