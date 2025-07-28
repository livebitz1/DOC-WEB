"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  inStock: boolean;
  image: string;
  tags: string[];
};

type FormState = {
  name: string;
  description: string;
  price: string;
  inStock: boolean;
  image: string;
  tags: string;
};

export default function AdminAddProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    inStock: true,
    image: "",
    tags: "",
  });
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle image file selection and upload to Cloudinary
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, image: data.secure_url }));
        setImagePreview(data.secure_url);
        setSuccess("Image uploaded!");
      } else {
        setSuccess("Image upload failed.");
      }
    } catch (err) {
      setSuccess("Image upload error.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setSubmitting(true);
    if (!form.name || !form.price) {
      setSuccess("Name and price are required.");
      setSubmitting(false);
      return;
    }
    if (!form.image) {
      setSuccess("Please upload an image.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price,
          inStock: form.inStock,
          imageUrl: form.image,
          tags: form.tags,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSuccess(data.error || "Failed to add product.");
        setSubmitting(false);
        return;
      }
      const product = await res.json();
      setProducts((prev) => [...prev, {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        image: product.imageUrl,
        tags: product.tags,
      }]);
      setForm({ name: "", description: "", price: "", inStock: true, image: "", tags: "" });
      setImagePreview("");
      setSuccess("Product added!");
    } catch (err) {
      setSuccess("Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className="py-12 max-w-2xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (e.g. $19.99)"
              className="w-full px-3 py-2 border rounded"
              required
            />
            <div>
              <label className="block mb-1 font-medium">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded"
                disabled={uploading}
              />
              {uploading && <div className="text-blue-600 mt-1">Uploading...</div>}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-contain mt-2 border rounded" />
              )}
            </div>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full px-3 py-2 border rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
              />
              In Stock
            </label>
            <Button type="submit" className="w-full bg-[#0077B6] text-white" disabled={submitting}>
              {submitting ? "Creating Product..." : "Add Product"}
            </Button>
            {success && <div className="text-green-600 mt-2">{success}</div>}
          </form>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-bold mb-4">Preview (Session Only)</h2>
        <div className="grid gap-6" style={{gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))'}}>
          {products.map((product: Product) => (
            <Card key={product.id} className="bg-white/90 border border-gray-200 shadow">
              <CardHeader className="flex flex-col items-center pb-2">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-contain mb-4" />
                <CardTitle className="text-xl font-bold text-gray-900 mb-2 text-center">{product.name}</CardTitle>
                <div className="flex gap-2 mb-2">
                  {product.tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="text-gray-600 text-sm mb-4 text-center">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-semibold text-[#0077B6]">{product.price}</span>
                  {product.inStock ? (
                    <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-xs">In Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-xs">Out of Stock</Badge>
                  )}
                </div>
                <Button disabled={!product.inStock} className="w-full bg-[#0077B6] hover:bg-[#005f8e] text-white">
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
