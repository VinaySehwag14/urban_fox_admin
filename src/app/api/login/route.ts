import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_KEY || "",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "Authentication failed" },
                { status: res.status }
            );
        }

        // Store the actual token from the API response
        const token = data.token;

        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({ success: true, user: data });
    } catch (error) {
        console.error("Login caught error:", error);
        console.log("Configuration Debug:", {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            hasApiKey: !!process.env.API_KEY
        });

        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : "Unknown error",
                debug: {
                    attemptedUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
                }
            },
            { status: 500 }
        );
    }
}
