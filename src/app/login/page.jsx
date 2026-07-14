"use client";

import React, { useState } from 'react'
import './login.css'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Page = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                formData
            );

            localStorage.setItem(
                "token",
                res.data.token
            );
            // alert(res.data.message || "Login Successful");
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "login Successful",
                timer: 1000,
                timerProgressBar: true,
            });
            router.push("/");

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Signup Failed",
                text:
                    error.response?.data?.message ||
                    "Something went wrong",
            });
        }
    };

    return (
        <section
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >
            <div
                className="bg-white p-5 shadow"
                style={{
                    width: "100%",
                    maxWidth: "800px"
                }}
            >

                <div className="text-center mb-4">
                    <Link href="/">
                        <img
                            src="/assets/img/logo-dark.svg"
                            alt="logo"
                            width={200}
                            className="img-fluid"
                        />
                    </Link>

                    <h5 className="mt-2 fw-bold">
                        Login
                    </h5>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control rounded-pill"
                            placeholder="Enter Email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control rounded-pill"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-dark w-100 rounded-pill py-2"
                    >
                        Login
                    </button>

                </form>

                <div className="d-flex justify-content-between mt-4">
                    <Link
                        href="/forgotPassword"
                        className="text-decoration-none text-dark"
                    >
                        Forgot Password?
                    </Link>

                    <Link
                        href="/singup"
                        className="text-decoration-none text-dark"
                    >
                        Don't have an account? Sign Up
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default Page