import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "RECRUITER" | "APPLICANT";
    } & DefaultSession["user"];
  }

  interface User {
    role: "RECRUITER" | "APPLICANT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "RECRUITER" | "APPLICANT";
  }
}
