import React from 'react'
import '../sampleOrder/sampleOrder.css'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import Link from 'next/link'
const page = () => {

    const SimpleOrder = [
        { id: "1", "name": "Order From Our Pre-Designed Samples", desc: "Test our print and packaging quality with your hands in 5-7 working days.", svgOne: "/assets/img/simpleOrdeicon-one.svg" },
        { id: "1", "name": "Design a box and order a single piece or more", desc: "Use our Dabba Tool to create the packaging you want because you get to order a single piece.", svgOne: "/assets/img/simpleOrdeicon-two.svg" },
        { id: "1", "name": "Upload ready designs and order instantly", desc: "Download the dieline of the box you want and upload it back with the design to order a sample.", svgOne: "/assets/img/simpleOrdeicon-three.svg" },
    ]



    return (
        <>
            <Navbar />
            <section>
                <div className='container py-3 mt-lg-3 mb-lg-4 mb-3'>
                    <div className='ms-1 py-4'>
                        <h2 className='ms-1'>Order a Sample Box</h2>
                        <p className='ms-2'>Experience our quality packaging solutions by ordering a single piece or more</p>
                    </div>
                    <div className='custom-width'>
                        <div className="row m-0">
                            {
                                SimpleOrder.map((SimpleOrderItem, index) => (
                                    <div key={index} className='col-lg-4 col-md-4 col-sm-6 col-12 mb-3'>
                                        <div className='Custom-Order-Warpper'>
                                            <div>
                                                <div className='text-center'>
                                                    <img className='img-fluid' src={SimpleOrderItem.svgOne} alt="" />
                                                </div>
                                                <div className='py-2 px-3 mt-md-5 mt-3'>
                                                    <h5 className='fw-bold'>{SimpleOrderItem.name}</h5>
                                                    <p className='fs-13'>{SimpleOrderItem.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='d-flex justify-content-between align-items-center mt-4 mx-3'>
                            <div>
                                <button className='px-md-5 px-3 py-3 rounded-2 border-0 text-capitalize custom-btn-left'>loocking for something</button>
                            </div>
                            <div><button className='px-md-5 px-3 py-3 rounded-2 border-0 text-capitalize custom-btn-right'>
                                 <Link className='text-decoration-none text-white' href="/canvas">
                                    Next
                                 </Link>

                                </button></div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

        </>
    )
}

export default page