import { clerkMiddleware } from "@clerk/nextjs/server";

// You can add custom logic here using Next.js middleware API if needed
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and public auth routes
    '/((?!_next|sign-in|sign-up|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
