import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        // Public access
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/categories`);

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch categories" },
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

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        const body = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/categories/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to create category" },
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
