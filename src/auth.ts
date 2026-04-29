import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const token = data.token ?? data.accessToken;

        if (!token) return null;

        return {
          id: String(data.id ?? data.idUsuario ?? ""),
          name: data.name ?? data.username ?? null,
          email: (data.email as string) ?? (credentials.email as string),
          accessToken: token as string,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
