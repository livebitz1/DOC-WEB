"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0077B6] via-[#caf0f8] to-[#f8fafc] px-4">
      <div className="absolute inset-0 z-0">
        <Image src="/globe.svg" alt="Dental Logo" width={180} height={180} className="absolute top-10 left-10 opacity-10" />
        <Image src="/vercel.svg" alt="Brand" width={120} height={120} className="absolute bottom-10 right-10 opacity-10" />
      </div>
      <div className="relative z-10 bg-white/90 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-8 border border-[#E5E7EB] items-center backdrop-blur">
        <h1 className="text-3xl font-extrabold text-[#0077B6] mb-2 tracking-tight">Create Your BlueWave Dental Account</h1>
        <p className="text-gray-600 text-center mb-4 text-base">Sign up to manage appointments, view your dental history, and access exclusive patient resources.</p>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" appearance={{
          elements: {
            formButtonPrimary: "bg-[#0077B6] hover:bg-[#005f8e] text-white font-bold text-lg rounded-lg py-3",
            card: "shadow-xl border border-[#E5E7EB] rounded-2xl",
            headerTitle: "text-[#0077B6] font-bold text-2xl",
            headerSubtitle: "text-gray-500 text-base",
          },
        }} />
      </div>
    </div>
  );
}
