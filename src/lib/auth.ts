/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token-dashboard",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const response = await res.json();

          if (!res.ok || !response?.success) {
            throw new Error(response?.message || "Invalid email or password");
          }

          const user = response.data.user;

          if (user.role !== "ADMIN") {
            throw new Error("Access denied! Only admin can login.");
          }

          console.log("response ke asa : ", response?.data?.accessToken);

          return {
            id: user._id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            verified: user.verified,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again."
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.verified = user.verified;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        verified: token.verified,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
};
