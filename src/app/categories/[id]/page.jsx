import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import Link from "next/link";
export default async function CategoryPage({ params }) {
    const { id } = await params;

   console.log(process.env.NEXT_PUBLIC_API_URL);

const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/product/category/${id}`,
  {
    cache: "no-store",
  }
);

console.log(res.status);

    return (
        <>
            <Navbar />
            <section className="container mt-lg-5 mb-lg-4 my-3">
                <div className="row m-0">

                    {data.products?.length > 0 ? (
                        data.products.map((item) => (
                            <div
                                key={item._id}
                                className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4"
                            >
                                <Link
                                    className="text-decoration-none text-dark"
                                    href={`/products/${item._id}`}
                                >
                                    <div className="category-card">
                                        <div className="category-image">
                                            <img
                                                src={item?.thumbnail?.url}
                                                alt={item.productName}
                                            />
                                        </div>

                                        <div className="category-content">
                                            <h6 className="text-center fs-4 fw-bold">
                                                {item.productName}
                                            </h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h3>No Products Found</h3>
                            <p>This category does not have any products yet.</p>
                        </div>
                    )}

                </div>
            </section>
            <Footer/>
        </>
    );
}