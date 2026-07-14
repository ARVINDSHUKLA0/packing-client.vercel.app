"use client";

import React, { useState } from 'react';
import './forgotPassword.css';
import Link from 'next/link';
import axios from 'axios';

const Page = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
                { email }
            );

            console.log(response.data);
            alert(response.data.message);

        } catch (error) {
            console.log(error.response?.data);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <section
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", background: "#f5f5f5" }}
        >
            <div className="forgot-card bg-white shadow">
                <div className="text-center mb-4">
                    <img
                        src="/assets/img/logo-dark.svg"
                        alt="logo"
                        width={220}
                        className="img-fluid"
                    />
                    <h2 className="mt-3 fw-bold">Forgot Password</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            className="form-control custom-input"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn custom-btn px-5 py-2"
                    >
                        Send Reset Link
                    </button>

                    <Link
                        href="/login"
                        className="text-decoration-none text-dark bg-info ms-3 px-5 mt-1 py-2 rounded-5"
                    >
                        Back to Login
                    </Link>
                </form>
            </div>
        </section>
    );
};

export default Page;