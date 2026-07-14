"use client";

import { useState } from "react";
import '../componentStyle/ProductGallery.css'
const ProductGallery = ({ product }) => {
  const allImages = [
    product?.thumbnail,
    ...(product?.images || []),
  ];

  const [selectedImage, setSelectedImage] = useState(
    product?.thumbnail?.url
  );

  return (
    <div className="product-gallery">
      <div className="thumbnail-list">
        {allImages.map((image, index) => (
          <img
            key={index}
            src={image?.url}
            alt=""
            className="thumbnail-img"
            onClick={() => setSelectedImage(image?.url)}
          />
        ))}
      </div>

      <div className="main-image">
        <img
          src={selectedImage}
          alt=""
          className="img-fluid"
        />
      </div>
    </div>
  );
};

export default ProductGallery;