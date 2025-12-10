import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/wishlist`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch wishlist" },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
