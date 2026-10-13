import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forwardAdminRequest(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Autentikasi diperlukan." },
      { status: 401 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const { path } = await params;
  const backendUrl = new URL(
    `/api/v1/admin/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
    baseUrl,
  );
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Tidak dapat terhubung ke server admin." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const backendContentType = backendResponse.headers.get("content-type");
  if (backendContentType) {
    responseHeaders.set("Content-Type", backendContentType);
  }

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  if (backendResponse.status === 401) {
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}

export const GET = forwardAdminRequest;
export const POST = forwardAdminRequest;
export const PUT = forwardAdminRequest;
export const DELETE = forwardAdminRequest;
