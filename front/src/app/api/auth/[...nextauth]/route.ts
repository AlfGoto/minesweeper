import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const env = getCloudflareContext().env as CloudflareEnv & {
  NEXTAUTH_SECRET?: string;
};

console.log("Secret in Worker env:", Boolean(env.NEXTAUTH_SECRET));
console.log("Secret in process.env:", Boolean(process.env.NEXTAUTH_SECRET));

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
