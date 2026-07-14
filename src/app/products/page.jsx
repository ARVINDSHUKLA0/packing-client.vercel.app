"use client";

import React, { useEffect, useState } from "react";
import '../products/products.css'
import Navbar from "@/component/Navbar";
import Link from "next/link";
import Footer from "@/component/Footer";

const Page = () => {
    const [products, setProducts] = useState([]);

   useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`)
        .then((res) => res.json())
        .then((data) => {
            setProducts(data.products);
        })
        .catch((err) => console.log(err));
}, []);

    return (
        <>
            <Navbar />

            <div className="container py-5">
                <div className="row m-0">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="col-lg-3 col-md-4 col-sm-6 col-6 mb-2"
                        >
                            <Link className="text-decoration-none text-dark" href={`/products/${product._id}`}>
                                <div className="category-card">
                                    <div className="category-image">
                                        <img
                                            src={product?.thumbnail?.url}
                                            alt={product.productName}
                                        />
                                    </div>

                                    <div className="category-content">
                                        <h6 className="text-center fs-4 fw-bold">
                                            {product.productName}
                                        </h6>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Page;