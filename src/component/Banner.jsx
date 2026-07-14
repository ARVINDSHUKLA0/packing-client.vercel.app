"use client";

import React, { useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../componentStyle/Banner.css";

const Banner = () => {
    const [slider, setSlider] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const bgColors = ['#03CCB7', '#F8485E', '#FFB81C', '#489FDF'];

    const slides = [
        {
            id: 1,
            img: "/assets/img/banner-1.png",
            alt: "Packaging Box 1",
        },
        {
            id: 2,
            img: "/assets/img/banner-2.png",
            alt: "Packaging Box 2",
        },
        {
            id: 3,
            img: "/assets/img/banner-3.png",
            alt: "Packaging Box 3",
        },
        {
            id: 4,
            img: "/assets/img/banner-4.png",
            alt: "Packaging Box 4",
        },
    ];

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (_, next) => setActiveSlide(next),
    };

    return (
        <section className="banner-section">
            <div className="container">
                <div className="row align-items-center flex-lg-row flex-column-reverse">
                    <div className="col-lg-6">
                        <div className="banner-content">
                            <h1 className="banner-title">
                                Customisable
                                <br />
                                Packaging
                                <br />
                                <span>for every need.</span>
                            </h1>

                            <button className="banner-btn">
                                DESIGN MY BOX
                            </button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-lg-6">
                        <div className="main-slider">
                            <Slider
                                ref={(s) => setSlider(s)}
                                {...settings}
                            >
                                {slides.map((item, index) => (
                                    <div key={item.id} className="px-5 pt-5 pb-3">
                                        <img
                                            src={item.img}
                                            alt={item.alt}
                                            className="main-image px-3"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        <div className="thumb-wrapper pb-3">
                            <div className="d-flex justify-content-center gap-4 flex-wrap">
                                {slides.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`thumb-box ${activeSlide === index ? "active-thumb" : ""}`}
                                        onClick={() => slider?.slickGoTo(index)}
                                        style={{ backgroundColor: bgColors[index % bgColors.length] }}
                                    >
                                        <img src={item.img} alt="" className="thumb-image" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
