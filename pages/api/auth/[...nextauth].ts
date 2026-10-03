import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" })],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) { return Boolean(user.email); },
    async jwt({ token, user }) {
      if (user) token.role = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim()).includes(user.email || "") ? "admin" : "member";
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = String(token.sub || ""); session.user.role = (token.role as "admin" | "member") || "member"; }
      return session;
    },
  },
});
