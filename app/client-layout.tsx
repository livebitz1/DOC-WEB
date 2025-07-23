"use client";
import StoreUserProfile from '../components/StoreUserProfile';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreUserProfile />
      {children}
    </>
  );
}
