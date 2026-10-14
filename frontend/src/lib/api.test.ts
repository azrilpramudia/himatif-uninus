import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAPI } from "./api";

describe("fetchAPI", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(fetchAPI<{ id: number }>("/api/admin/events")).resolves.toEqual({
      id: 1,
    });
  });

  it("uses the API error message for failed responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Unggahan ditolak." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(fetchAPI("/api/admin/upload")).rejects.toThrow(
      "Unggahan ditolak.",
    );
  });

  it("explains when the server cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(fetchAPI("/api/admin/events")).rejects.toThrow(
      "Tidak dapat terhubung ke server.",
    );
  });

  it("does not set Content-Type manually for multipart uploads", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const formData = new FormData();
    formData.append("image", new Blob(["image"]), "photo.png");
    await fetchAPI("/api/admin/upload", { method: "POST", body: formData });

    const [, request] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(request.body).toBe(formData);
    expect(new Headers(request.headers).has("Content-Type")).toBe(false);
  });
});
