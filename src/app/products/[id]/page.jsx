// import Footer from "@/component/Footer";
// import Navbar from "@/component/Navbar";
// import ProductGallery from "@/component/ProductGallery";
// import "./productDetails.css";
// import Link from "next/link";


// const Page = async ({ params }) => {
//   const { id } = await params;

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
//     {
//       cache: "no-store",
//     }
//   );
//   const data = await response.json();
//   const product = data.product;


//   return (
//     <>
//       <Navbar />

//       <section className="product-details py-5">
//         <div className="container">
//           <div className="row align-items-start">

//             <div className="col-lg-6">
//               <ProductGallery product={product} />
//             </div>

//             <div className="col-lg-6 ps-md-4 mt-3">
//               <h1 className="product-title">
//                 {product?.productName}
//               </h1>

//               <p className="product-short-desc">
//                 {product?.shortDescription}
//               </p>

//               <div className="mt-4">
//                 <p>{product?.description}</p>
//               </div>

//               <div className="product-features">
//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productOneSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6> Premium Quality</h6>
//                   </div>
//                 </div>

//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productTwoSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6> High Quality Print</h6>
//                   </div>

//                 </div>

//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productThreeSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6> Easy Assembly</h6>
//                   </div>
//                 </div>
//               </div>



//               <div className="shipping-box">
//                 Shipping Available
//                 <div className="mt-2"> Are you a new user?
//                   <Link href="#" className="text-decoration-none">  Order a Sample</Link>
//                 </div>
//               </div>
//               <Link className="text-decoration-none text-white" href="/canvas">
//                 <button className="design-btn">
//                   DESIGN MY BOX
//                 </button>
//               </Link>
//             </div>

//           </div>
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// };

// export default Page;










// import Footer from "@/component/Footer";
// import Navbar from "@/component/Navbar";
// import ProductGallery from "@/component/ProductGallery";
// import "./productDetails.css";
// import Link from "next/link";

// const Page = async ({ params }) => {
//   const { id } = await params;
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
//     {
//       cache: "no-store",
//     }
//   );
//   const data = await response.json();
//   console.log("hh", data)
//   const product = data.product;

//   // 🔥 Box style ID extract karo
//   const boxStyleId = product?.boxStyle?._id || product?.boxStyle;

//   return (
//     <>
//       <Navbar />

//       <section className="product-details py-5">
//         <div className="container">
//           <div className="row align-items-start">

//             <div className="col-lg-6">
//               <ProductGallery product={product} />
//             </div>

//             <div className="col-lg-6 ps-md-4 mt-3">
//               <h1 className="product-title">
//                 {product?.productName}
//               </h1>

//               <p className="product-short-desc">
//                 {product?.shortDescription}
//               </p>

//               <div className="mt-4">
//                 <p>{product?.description}</p>
//               </div>

//               <div className="product-features">
//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productOneSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6>Premium Quality</h6>
//                   </div>
//                 </div>

//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productTwoSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6>High Quality Print</h6>
//                   </div>
//                 </div>

//                 <div className="feature-item d-flex align-items-center gap-3">
//                   <div>
//                     <img className="img-fluid" src="/assets/img/productThreeSvg.svg" width={30} alt="" />
//                   </div>
//                   <div>
//                     <h6>Easy Assembly</h6>
//                   </div>
//                 </div>
//               </div>

//               <div className="shipping-box">
//                 Shipping Available
//                 <div className="mt-2"> 
//                   Are you a new user?
//                   <Link href="#" className="text-decoration-none">Order a Sample</Link>
//                 </div>
//               </div>

//               {/* 🔥 FIX - Dynamic Link with boxStyleId */}
//               {boxStyleId ? (
//                 <Link 
//                   className="text-decoration-none text-white" 
//                   href={`/canvas/${boxStyleId}`}  // 🔥 Dynamic ID pass karo
//                 >
//                   <button className="design-btn">
//                     DESIGN MY BOX
//                   </button>
//                 </Link>
//               ) : (
//                 <button 
//                   className="design-btn" 
//                   disabled
//                   style={{ opacity: 0.5, cursor: 'not-allowed' }}
//                 >
//                   Box Style Not Available
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// };

// export default Page;


























import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import ProductGallery from "@/component/ProductGallery";
import "./productDetails.css";
import Link from "next/link";

const Page = async ({ params }) => {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
    {
      cache: "no-store",
    }
  );
  const data = await response.json();
  const product = data.product;

  // 🔥 Box style ID extract karo
  const boxStyleId = product?.boxStyle?._id || product?.boxStyle;

  return (
    <>
      <Navbar />

      <section className="product-details py-5">
        <div className="container">
          <div className="row align-items-start">

            <div className="col-lg-6">
              <ProductGallery product={product} />
            </div>

            <div className="col-lg-6 ps-md-4 mt-3">
              <h1 className="product-title">
                {product?.productName}
              </h1>

              <p className="product-short-desc">
                {product?.shortDescription}
              </p>

              <div className="mt-4">
                <p>{product?.description}</p>
              </div>

              <div className="product-features">
                <div className="feature-item d-flex align-items-center gap-3">
                  <div>
                    <img className="img-fluid" src="/assets/img/productOneSvg.svg" width={30} alt="" />
                  </div>
                  <div>
                    <h6> Premium Quality</h6>
                  </div>
                </div>

                <div className="feature-item d-flex align-items-center gap-3">
                  <div>
                    <img className="img-fluid" src="/assets/img/productTwoSvg.svg" width={30} alt="" />
                  </div>
                  <div>
                    <h6> High Quality Print</h6>
                  </div>
                </div>

                <div className="feature-item d-flex align-items-center gap-3">
                  <div>
                    <img className="img-fluid" src="/assets/img/productThreeSvg.svg" width={30} alt="" />
                  </div>
                  <div>
                    <h6> Easy Assembly</h6>
                  </div>
                </div>
              </div>

              <div className="shipping-box">
                Shipping Available
                <div className="mt-2"> 
                  Are you a new user?
                  <Link href="#" className="text-decoration-none">Order a Sample</Link>
                </div>
              </div>

              {/* 🔥 FIX - Product ki keyline aur GLB canvas mein aayegi */}
              {boxStyleId ? (
                <Link 
                  className="text-decoration-none text-white" 
                  href={`/canvas/${boxStyleId}?productId=${product?._id}`} 
                >
                  <button className="design-btn">
                    DESIGN MY BOX
                  </button>
                </Link>
              ) : (
                <button 
                  className="design-btn" 
                  disabled
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Box Style Not Available
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Page;




































