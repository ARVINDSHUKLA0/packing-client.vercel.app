"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
    const { token } = useParams();
    const router = useRouter();

    const [message, setMessage] = useState("Verifying your email...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/${token}`
                );
                setMessage(res.data.message);

                setTimeout(() => {
                    router.push("/login");
                }, 3000);

            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "Email verification failed."
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, router]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <h2>{loading ? "Please wait..." : message}</h2>

            {!loading && (
                <p>You will be redirected to the login page.</p>
            )}
        </div>
    );
}