import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AppProviders } from "next-auth/providers";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { authConfig } from "./auth.config";

const prisma = new PrismaClient();
const hasConfiguredValue = (value: string | undefined): value is string =>
  Boolean(value && value.trim() && !value.trim().toLowerCase().startsWith("your-"));

const googleClientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
const microsoftClientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID;
const microsoftClientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET;
const microsoftIssuer = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER;
const appleClientId = process.env.AUTH_APPLE_ID;
const appleClientSecret = process.env.AUTH_APPLE_SECRET;

const providers: AppProviders = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.passwordHash) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password as string,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    },
  }),
];

if (hasConfiguredValue(googleClientId) && hasConfiguredValue(googleClientSecret)) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

if (hasConfiguredValue(microsoftClientId) && hasConfiguredValue(microsoftClientSecret)) {
  providers.push(
    MicrosoftEntraID({
      clientId: microsoftClientId,
      clientSecret: microsoftClientSecret,
      ...(hasConfiguredValue(microsoftIssuer) ? { issuer: microsoftIssuer } : {}),
    })
  );
}

if (hasConfiguredValue(appleClientId) && hasConfiguredValue(appleClientSecret)) {
  providers.push(
    Apple({
      clientId: appleClientId,
      clientSecret: appleClientSecret,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id;
      }
      return session;
    },
  },
});
