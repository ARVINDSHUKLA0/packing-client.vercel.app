"use client";
import React, { useEffect, useState } from 'react'
import '../componentStyle/Navbar.css'
import Link from 'next/link'

const Navbar = () => {
    const [token, setToken] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        setToken(userToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/";
    };
    return (
        <>
            <nav className='custom-bg py-2'>
                <div className='container'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                           <Link href="/">
                            <img className='img-fluid' src="/assets/img/logo-dark.svg" alt="logo" width={190} />
                           </Link>
                        </div>
                        <div>
                            <ul className={`custom-display gap-4 m-0 p-0 ${menuOpen ? "mobile-menu-active" : ""}`}>
                                <li className='close-menu list-style-none'>
                                    <i
                                        className="fa-solid fa-xmark"
                                        onClick={() => setMenuOpen(false)}
                                    ></i>
                                </li>
                                <li className='list-style-none my-3'>
                                    <Link className='text-decoration-none text-dark fs-14 fw-bold text-capitalize' href="/products">Products</Link>
                                </li>
                                <li className='list-style-none py-3'>
                                    <Link className='text-decoration-none text-dark fs-14 fw-bold text-capitalize' href="/sampleOrder">Order A Sample</Link>
                                </li>

                                    <li onClick={() => setDropdownOpen(!dropdownOpen)} className='list-style-none py-3 position-relative custom-hover-menu'>
                                        <Link
                                            className='text-decoration-none text-dark fs-14 fw-bold text-capitalize'
                                            href="#"
                                        >
                                            Get In Touch
                                            <i className={`fa-solid fa-caret-down ms-1 ${dropdownOpen ? "rotate-icon" : ""}`}></i>
                                        </Link>

                                        <div  className={`dropdwon-postion ${dropdownOpen ? "dropdown-open" : ""}`}>
                                            <ul className='m-0 p-0'>
                                                <li className='list-style-none py-2 fs-14 fw-bold text-capitalize'>
                                                    <Link className='text-decoration-none text-dark' href="#">about</Link>
                                                </li>
                                                <li className='list-style-none py-2 fs-14 fw-bold text-capitalize'>
                                                    <Link className='text-decoration-none text-dark' href="#">contact us</Link>
                                                </li>
                                                <li className='list-style-none py-2 fs-14 fw-bold text-capitalize'>
                                                    <Link className='text-decoration-none text-dark' href="#">download dieline</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                <li className='list-style-none my-2'>
                                    <Link className='text-decoration-none ' href="#">
                                        <button className='text-dark fs-12 fw-bold text-capitalize px-3 py-2 rounded-2'>get an estimate</button>
                                    </Link>
                                </li>
                                <li className='list-style-none my-3'>
                                    <Link href="#">
                                        <i className="fa-solid fa-cart-arrow-down text-dark"></i>
                                    </Link>
                                </li>
                                <li className='user-menu list-style-none py-3 position-relative'>
                                    <Link href="#">
                                        <i className="fa-regular fa-user text-dark"></i>
                                    </Link>

                                    <div className='dropdown-menu-custom'>
                                        <ul className='p-0 m-0'>
                                            <li className='list-style-none'>
                                                {
                                                    token ? (
                                                        <button
                                                            onClick={handleLogout}
                                                            className='btn btn-danger px-4'
                                                        >
                                                            Logout
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            className='text-decoration-none text-dark fs-14 fw-bold text-capitalize'
                                                            href="/login"
                                                        >
                                                            <button className='btn btn-primary px-4'>
                                                                Login
                                                            </button>
                                                        </Link>
                                                    )
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className='display-hide'>
                            <Link   onClick={() => setMenuOpen(true)} className='text-dark' href="#">
                                <i className="fa-solid fa-bars"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar












