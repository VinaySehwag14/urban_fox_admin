import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { productId, variantId, stock } = body;

        // User spec: variantId and stock are required. productId is optional.
        if (!variantId || stock === undefined || stock === null) {
            return NextResponse.json({ error: "Missing required fields: variantId and stock" }, { status: 400 });
        }

        const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/inventory/update`;
        console.log("Proxying to:", targetUrl); // Debug log for server terminal

        // Proxy to the backend endpoint as requested by user
        const res = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId,
                variantId,
                stock
            }),
        });

        const data = await res.json().catch(() => ({})); // Handle empty/non-json response

        if (!res.ok) {
            return NextResponse.json(
                {
                    error: data.message || "Failed to update inventory",
                    debug_url: targetUrl,
                    debug_status: res.status
                },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Inventory Update Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
