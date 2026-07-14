// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter, useParams } from "next/navigation";

// export default function Page() {
//     const router = useRouter();
//     const params = useParams();

//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (password !== confirmPassword) {
//             alert("Passwords do not match");
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 "http://localhost:8080/api/auth/reset-password",
//                 {
//                     token: params.token,
//                     password,
//                     confirmPassword,
//                 }
//             );

//             alert(response.data.message);
//             router.push("/login");
//         } catch (error) {
//             alert(
//                 error.response?.data?.message ||
//                 "Something went wrong"
//             );
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="mb-4">Reset Password</h1>

//             <p className="mb-4">
//                 Token: {params.token}
//             </p>

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label>New Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label>Confirm Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                 </div>

//                 <button type="submit" className="btn btn-dark">
//                     Save Password
//                 </button>
//             </form>
//         </div>
//     );
// }


"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import '../resetPassword.css'

export default function Page() {
    const router = useRouter();
    const params = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
                {
                    token: params.token,
                    password,
                    confirmPassword,
                }
            );

            alert(response.data.message);
            router.push("/login");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <section className="reset-password-section">
            <div className="reset-card">
                <div className="text-center">
                    <img
                        src="/assets/img/logo-dark.svg"
                        alt="logo"
                        className="img-fluid mb-3"
                        width={220}
                    />

                    <h2 className="reset-title">
                        Reset Password
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">
                            New Password
                        </label>

                        <input
                            type="password"
                            className="form-control custom-input"
                            placeholder="Enter New Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            className="form-control custom-input"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn reset-btn"
                    >
                        Save Password
                    </button>
                </form>
            </div>
        </section>
    );
}