"use client";
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function StoreUserProfile() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const storeUser = async () => {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          }),
        });
      };
      storeUser();
    }
  }, [isSignedIn, user]);

  return null;
}
