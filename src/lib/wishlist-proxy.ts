import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api-url";

export async function proxyWishlistRequest(request: Request, endpoint: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Not authenticated." },
      { status: 401 },
    );
  }

  const contentType = request.headers.get("content-type");
  const response = await fetch(buildApiUrl(endpoint), {
    method: request.method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    body: request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text(),
    cache: "no-store",
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
