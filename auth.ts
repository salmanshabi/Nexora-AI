import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AppProviders } from "next-auth/providers";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { authConfig } from "./auth.config";

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

      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email as string,
        password: credentials.password as string,
      });

      if (error || !data.user) {
        return null;
      }

      return {
        id: data.user.id,
        name: data.user.user_metadata?.full_name ?? data.user.email ?? "",
        email: data.user.email ?? "",
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
    async signIn({ user, account }) {
      // For OAuth providers, find or create the user in Supabase Auth
      // so session.user.id is always a Supabase Auth UUID
      if (account?.provider === "credentials") return true;
      if (!user.email) return false;

      try {
        const supabase = createSupabaseAdminClient();

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (profile?.id) {
          user.id = profile.id;
        } else {
          const { data: created, error } = await supabase.auth.admin.createUser({
            email: user.email,
            email_confirm: true,
            user_metadata: {
              full_name: user.name ?? "",
              avatar_url: user.image ?? "",
            },
          });

          if (error || !created.user) {
            console.error("Failed to create Supabase user for OAuth:", error);
            return false;
          }

          user.id = created.user.id;

          // Create profile row (non-fatal)
          supabase.from("profiles").insert({
            id: created.user.id,
            email: user.email,
            full_name: user.name ?? "",
            avatar_url: user.image ?? null,
          }).then(({ error: profileError }) => {
            if (profileError) console.error("Failed to create OAuth profile:", profileError);
          });
        }
      } catch (err) {
        console.error("OAuth Supabase sync error:", err);
        return false;
      }

      return true;
    },
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
