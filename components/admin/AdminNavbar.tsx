import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="w-full bg-blue-800 text-white py-4 px-8 flex items-center justify-between shadow">
      <div className="font-bold text-xl">Admin Panel</div>
      <div className="flex gap-6">
        <Link href="/Live701" className="hover:underline">Create Profile</Link>
        <Link href="/Live701/dentists" className="hover:underline">Dentists</Link>
        <Link href="/Live701/bookings" className="hover:underline">Bookings</Link>
        <Link href="/Live701/admin-add-product" className="hover:underline">Add Product</Link>
        <Link href="/products/list" className="hover:underline">Products List</Link>
      </div>
    </nav>
  );
}
