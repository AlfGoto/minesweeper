import { getUser } from "@/types/bff/functions";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await getUser(session.user?.email ?? "");
      return {
        ...session,
        skins: {
          background: user?.selectedSkin?.background ?? "default",
          banner: user?.selectedSkin?.banner ?? "default",
          cells: user?.selectedSkin?.cells ?? "default",
        },
      };
    },
  },
});

export { handler as GET, handler as POST };
