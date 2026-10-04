import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb, hasDatabase } from "@/lib/db";

export default NextAuth({
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" }),
    CredentialsProvider({
      name: "Alias de acceso",
      credentials: { email: { label: "Email", type: "email" }, alias: { label: "Alias", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.alias) return null;
        if (!hasDatabase()) return credentials.email === "admin@uniendosonrisas.org" && credentials.alias === "sol-risa-luz" ? { id: "demo-admin", name: "Admin Fundación", email: credentials.email, role: "admin" } : null;
        const sql = getDb();
        const rows = await sql`SELECT id, name, email, role FROM admin_users WHERE email=${credentials.email} AND access_alias=${credentials.alias} AND status='Activo' LIMIT 1`;
        return rows[0] ? { id: String(rows[0].id), name: String(rows[0].name), email: String(rows[0].email), role: String(rows[0].role) === "member" ? "member" as const : "admin" as const } : null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) { return Boolean(user.email); },
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role || ((process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim()).includes(user.email || "") ? "admin" : "member");
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = String(token.sub || ""); session.user.role = (token.role as "admin" | "member") || "member"; }
      return session;
    },
  },
});
