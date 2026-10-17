import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export async function GET(request: Request, context: unknown) {
  console.log("NEXTAUTH_SECRET exists:", Boolean(process.env.NEXTAUTH_SECRET));

  const cf = getCloudflareContext();
  console.log(
    "Cloudflare binding exists:",
    Boolean(
      (cf.env as CloudflareEnv & { NEXTAUTH_SECRET?: string }).NEXTAUTH_SECRET,
    ),
  );

  return handler(request, context as never);
}

export const POST = handler;
