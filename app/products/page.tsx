"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/home/Navigation";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="py-12 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 text-[#0077B6] border-[#0077B6] px-4 py-2 text-sm font-medium">
              PRODUCTS
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Our Dental Products</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Shop our curated selection of dental care products recommended by our professionals.
            </p>
            <div className="flex justify-center mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name..."
                className="w-full max-w-xs sm:max-w-md px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] bg-white"
              />
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 text-lg">Loading products...</div>
          ) : (
            <div
              className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-white border border-black shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col items-center min-h-[320px] w-full">
                    <CardHeader className="flex flex-col items-center pb-2 px-2 w-full">
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-contain mb-2 rounded bg-gray-50 border" />
                      <CardTitle className="text-base font-semibold text-gray-900 mb-1 text-center truncate w-full">{product.name}</CardTitle>
                      <div className="flex gap-1 mb-1 flex-wrap justify-center">
                        {product.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center px-2 w-full flex-1">
                      <p className="text-gray-600 text-xs mb-2 text-center line-clamp-2 min-h-[32px]">{product.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-[#0077B6]">
                          {typeof product.price === "number" ? `$${product.price.toFixed(2)}` : product.price.startsWith("$") ? product.price : `$${product.price}`}
                        </span>
                        {product.inStock ? (
                          <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-xs">In Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-xs">Out of Stock</Badge>
                        )}
                      </div>
                      <Button disabled={!product.inStock} className="w-full bg-[#0077B6] hover:bg-[#005f8e] text-white text-sm py-2 h-9 mt-auto">
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500 text-lg">No products found.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
