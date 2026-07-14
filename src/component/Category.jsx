"use client";

import React, { useEffect, useState } from "react";
import "../componentStyle/Category.css";
import { useRouter } from "next/navigation";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/all`
        );
        const data = await response.json();

        if (data?.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Category Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="category-section">
        <div className="container">
          <h2>Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="category-section">
      <div className="container">
        <div className="category-header">
          <h2 className="category-title">Our Categories</h2>
        </div>

        <div className="row">
          {categories.map((category) => (
            <div
              onClick={() => router.push(`/categories/${category._id}`)}
              key={category._id}
              className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4"
            >
              <div className="category-card">
                <div className="category-image">
                  <img
                    src={category?.categoryImage?.url}
                    alt={category?.categoryName}
                  />
                </div>

                <div className="category-content">
                  <h3>{category?.categoryName}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;