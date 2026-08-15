import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api-url";

export async function proxyOrderRequest(endpoint: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
  }

  const response = await fetch(buildApiUrl(endpoint), {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
  });
}
