"use client";

import styles from "./page.module.css";
import Navbar from "@/component/Navbar";
import Banner from "@/component/Banner";
import Category from "@/component/Category";

import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import Footer from "@/component/Footer";

export default function Home() {

  const product = {
    images: [
      {
        url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338"
      },
      {
        url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282"
      },
      {
        url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
      },
      {
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
      },
      {
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
      },
      {
        url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282"
      },
      {
        url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
      },
      {
        url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
      },
    ]
  };

  const Benefit = [
    { id: "1", name: "No minimum order", imageOne: "/assets/img/benef1.svg", desc: "We serve everyone from small business to large MNCs and fulfil orders as less as 25 boxes. Ordering bulk quantities is no longer a constraint." },
    { id: "1", name: "Easy designing", imageOne: "/assets/img/benef2.svg", desc: "With our 3d design tool, everyone can design awesome looking custom packaging online with no knowledge of professional design skills at all!" },
    { id: "1", name: "Industry experience", imageOne: "/assets/img/benef3.svg", desc: "With over 35 years of industry experience, we are here to guide you to the right packaging for your brand." },
    { id: "1", name: "Real-time pricing estimates", imageOne: "/assets/img/benef4.svg", desc: "You no longer have to wait to hear back. Get instant quotes and make a purchase decision." },
    { id: "1", name: "Fast turnarounds", imageOne: "/assets/img/benef5.svg", desc: "We can ship your order in 10-15 working days to make sure you have the right tools to make that impression" },
  ]

  return (
    <div className={styles.page}>
      <Navbar />
      <Banner />
      <Category />

      <section className="container my-2">
        <div className="row">
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
          >
            {product.images.map((img, index) => (
              <a
                key={index}
                href={img.url}
                className="col-lg-3 col-md-4 col-6 mb-4 d-inline-block px-3"
              >
                <img
                  src={img.url}
                  alt={`image-${index}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </a>
            ))}
          </LightGallery>
        </div>
      </section>

      <section className={`${styles.customBgSection}`}>
        <div className="container mb-4">
          <div className="row m-0 py-4 align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <div>
                <h4>Order a sample</h4>
                <p className={`${styles.customWidth}`}>Transform your innovative ideas into a reality by designing custom packaging online with our 3D editor. With quantities starting from as little as 25 boxes, we cater to packaging for small business as well as large organizations.</p>
                <div className={`d-flex gap-lg-5 gap-3 align-items-center flex-wrap`}>
                  <div>
                    <button className="px-3 py-2 border-0 bg-primary text-white rounded-3 text-capitalize"> order a sample </button>
                  </div>
                  <div>
                    <button className={`px-3 py-2 border-0 text-dark rounded-3 text-capitalize  bg-light`}>get an estimate</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-12">
              <img className="img-fluid" src="/assets/img/sample.png"></img>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="container">
          <h2 className="fw-bold text-center text-capitalize my-4">How Do You Benefit?</h2>
          <div className={`d-flex gap-3 flex-wrap`}>
            {
              Benefit.map((BenefitItem, index) => (
                <div key={index} className={`${styles.customHeight} flex-warp`}>
                  <div className={styles.cardContent}>

                    <img
                      src={BenefitItem.imageOne}
                      alt=""
                      className={`${styles.cardImage} mb-3`}
                    />

                    <h6>{BenefitItem.name}</h6>

                    <p className={`${styles.cardDesc} fs-14`}>
                      {BenefitItem.desc}
                    </p>

                  </div>
                </div>

              ))
            }
          </div>

        </div>
      </section >

 <Footer/>

    </div >
  );
}