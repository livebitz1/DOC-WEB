import { clerkMiddleware } from "@clerk/nextjs/server";

// You can add custom logic here using Next.js middleware API if needed
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|sign-in|sign-up|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
