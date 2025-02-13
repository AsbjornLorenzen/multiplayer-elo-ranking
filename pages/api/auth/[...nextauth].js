import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  providers: [
    Auth0Provider({
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        issuer: process.env.AUTH0_ISSUER
      }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
}

export default NextAuth(authOptions)