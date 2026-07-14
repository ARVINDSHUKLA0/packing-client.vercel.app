import React from "react";
import "../componentStyle/Footer.css";

const Footer = () => {
    return (
        <>
            <footer className="footer-section">
                <div className="container">
                    <div className="row">

                        {/* Logo */}
                        <div className="col-lg-3 col-md-12">
                            <div className="footer-logo">
                                <img
                                    src="/assets/img/logo-light.svg"
                                    alt="logo"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-6 mb-4">
                            <h5>Company</h5>

                            <ul className="footer-links m-0">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Cancellation & Refund Policy</a></li>
                                <li><a href="#">Shipping Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-6 col-6 mb-4 ps-4">
                            <h5>Packaging</h5>

                            <ul className="footer-links">
                                <li><a href="#">Rigid Box</a></li>
                                <li><a href="#">Mailer Box</a></li>
                                <li><a href="#">Paper Box</a></li>
                                <li><a href="#">Carry Bag</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-8 mb-4">
                            <h5>Packaging for Industries</h5>

                            <div className="industry-list">
                                <ul className="footer-links">
                                    <li><a href="#">Boxes for Jewellery</a></li>
                                    <li><a href="#">Boxes for Gifts</a></li>
                                    <li><a href="#">Boxes for Bakery</a></li>
                                    <li><a href="#">Cake Boxes</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4">
                            <h5>Follow Us</h5>

                            <div className="social-icons">
                                <a href="#">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>

                                <a href="#">
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>

                                <a href="#">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="container">
                        <div className="row align-items-center">

                            <div className="col-md-4 text-center text-md-start">
                                © 2020 Dabba Factory
                            </div>

                            <div className="col-md-4 text-center">
                                Contact Us
                            </div>

                            <div className="col-md-4 text-center text-md-end">
                                Designed & Developed by <strong>Arvind Shukla</strong>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;