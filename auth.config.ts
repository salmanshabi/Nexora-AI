import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize() {
                // Validation now happens centrally in authorize using Prisma in `auth.ts`
                // We will decouple config here to fix the edge runtime issue.
                return null;
            }
        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnBuilder = nextUrl.pathname.startsWith("/builder");

            if (isOnDashboard || isOnBuilder) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
};
