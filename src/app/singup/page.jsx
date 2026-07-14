"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import './singup.css'
import Swal from "sweetalert2";

const Page = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Password and Confirm Password do not match");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }
            );

            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Signup Successful",
                text: "Please check your email and verify your account.",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            });

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
        <section className="signup-section">
            <div className="signup-card">

                <div className="text-center mb-2">
                    <Link href="/">
                        <img
                            src="/assets/img/logo-dark.svg"
                            alt="logo"
                            className="logo"
                        />
                    </Link>
                    <h5 className="signup-title">Sign Up</h5>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-2">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control custom-input"
                        />
                    </div>

                    <div className="mb-2">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control custom-input"
                        />
                    </div>

                    <div className="mb-2">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-control custom-input"
                        />
                    </div>

                    <div className="mb-2">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-control custom-input"
                        />
                    </div>

                    <div className="mb-2">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-control custom-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="signup-btn"
                    >
                        Sign Up
                    </button>

                    <div className="text-end mt-2">
                        <span>
                            Already have an account?{" "}
                            <Link href="/login">
                                Sign In
                            </Link>
                        </span>
                    </div>

                </form>

            </div>
        </section>
    )
}

export default Page