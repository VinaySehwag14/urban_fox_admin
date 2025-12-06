import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        const body = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/edit/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to update user" },
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to delete user" },
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
