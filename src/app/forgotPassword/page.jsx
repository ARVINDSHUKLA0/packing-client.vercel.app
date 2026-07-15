// "use client";

// import React, { useState } from "react";
// import "./forgotPassword.css";
// import Link from "next/link";
// import axios from "axios";
// import Swal from "sweetalert2";
// const Page = () => {
//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setLoading(true);

//         console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
//         console.log("Email:", email);

//         try {
//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
//                 { email }
//             );

//             console.log("Status:", response.status);
//             console.log("Response:", response.data);

//             alert(response.data.message);

//         } catch (error) {

//             console.log("=========== ERROR ===========");
//             console.log("Status:", error.response?.status);
//             console.log("Response:", error.response?.data);
//             console.log("Message:", error.message);
//             console.log(error);

//             alert(
//                 error.response?.data?.message ||
//                 error.message ||
//                 "Something went wrong"
//             );

//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <section
//             className="d-flex justify-content-center align-items-center"
//             style={{ minHeight: "100vh", background: "#f5f5f5" }}
//         >
//             <div className="forgot-card bg-white shadow">
//                 <div className="text-center mb-4">
//                     <img
//                         src="/assets/img/logo-dark.svg"
//                         alt="logo"
//                         width={220}
//                         className="img-fluid"
//                     />

//                     <h2 className="mt-3 fw-bold">
//                         Forgot Password
//                     </h2>
//                 </div>

//                 <form onSubmit={handleSubmit}>

//                     <div className="mb-4">
//                         <label className="form-label">
//                             Email Address
//                         </label>

//                         <input
//                             type="email"
//                             className="form-control custom-input"
//                             placeholder="Enter Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="btn custom-btn px-5 py-2"
//                         disabled={loading}
//                     >
//                         {loading ? "Sending..." : "Send Reset Link"}
//                     </button>

//                     <Link
//                         href="/login"
//                         className="text-decoration-none text-dark bg-info ms-3 px-5 mt-1 py-2 rounded-5"
//                     >
//                         Back to Login
//                     </Link>

//                 </form>
//             </div>
//         </section>
//     );
// };

// export default Page;








"use client";

import React, { useState } from "react";
import "./forgotPassword.css";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

const Page = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
                { email }
            );

            // ✅ Success
            // Swal.fire({
            //     icon: "success",
            //     title: response.data.message || "Reset link sent successfully",
            //     confirmButtonText: "OK",
            //     confirmButtonColor: "#6366f1",
            //     customClass: {
            //         popup: "custom-swal-popup",
            //         title: "custom-swal-title",
            //     },
            // });

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: response.data.message || "Reset link sent successfully",
                showConfirmButton: false,
                timer: 1500
            });

            setEmail(""); // input clear kar do

        } catch (error) {

            console.log("=========== ERROR ===========");
            console.log(error);

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            // ❌ Error
            // Swal.fire({
            //     icon: "error",
            //     title: "Failed",
            //     text: errorMessage,
            //     confirmButtonColor: "#dc2626",
            // });

              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed",
                showConfirmButton: false,
                timer: 1500,
                text: errorMessage,
                confirmButtonColor: "#dc2626",
            });


        } finally {
            setLoading(false);
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

                    <h2 className="mt-3 fw-bold">
                        Forgot Password
                    </h2>
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
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn custom-btn px-5 py-2"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
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