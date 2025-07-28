"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products List</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded border" />
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{product.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-blue-700 font-bold">{product.price}</td>
                  <td className="px-4 py-2">
                    {product.inStock ? (
                      <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-xs">In Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-xs">Out of Stock</Badge>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
