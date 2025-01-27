import NextAuth from 'next-auth/next';  // Use the Edge-compatible version
import CredentialsProvider from 'next-auth/providers/credentials';
import { client } from '@/lib/sanity';

// Keep Edge runtime
export const runtime = 'edge';

// Define Auth config
const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Use fetch instead of direct Sanity client for Edge compatibility
          const res = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=*[_type == "user" && email == $email][0]`, {
            headers: {
              'Authorization': `Bearer ${process.env.SANITY_API_TOKEN}`
            },
            body: JSON.stringify({
              email: credentials?.email
            })
          });

          const user = await res.json();

          if (!user.result) {
            return null;
          }

          if (credentials?.password === user.result.password) {
            return {
              id: user.result._id,
              name: user.result.name,
              email: user.result.email,
              role: user.result.role
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  }
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };