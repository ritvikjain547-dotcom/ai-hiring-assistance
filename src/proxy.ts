import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const proxyHandler = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isRecruiterRoute = nextUrl.pathname.startsWith("/dashboard/recruiter");
  const isApplicantRoute = nextUrl.pathname.startsWith("/dashboard/applicant");

  // Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    if (userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/dashboard/recruiter", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard/applicant", nextUrl));
  }

  // Protect dashboard routes
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Handle logged-in users on dashboard routes
  if (isDashboard && isLoggedIn) {
    // If the role is missing, default to APPLICANT to prevent infinite loops, 
    // or you could redirect to a setup page.
    const role = userRole || "APPLICANT";

    if (isRecruiterRoute && role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/dashboard/applicant", nextUrl));
    }

    if (isApplicantRoute && role !== "APPLICANT") {
      return NextResponse.redirect(new URL("/dashboard/recruiter", nextUrl));
    }

    // Redirect generic /dashboard to role-specific dashboard
    if (nextUrl.pathname === "/dashboard") {
      if (role === "RECRUITER") {
        return NextResponse.redirect(new URL("/dashboard/recruiter", nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard/applicant", nextUrl));
    }
  }

  return NextResponse.next();
});

export { proxyHandler as proxy };

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
