import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/wishlist/${productId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to add to wishlist" },
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/wishlist/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to remove from wishlist" },
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
