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

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
  }

  const headers = new Headers({ "Content-Type": "application/json" });

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

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
