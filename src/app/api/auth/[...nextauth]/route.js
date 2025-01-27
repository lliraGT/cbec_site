import NextAuth from 'next-auth/next';  // Changed to edge-compatible import
import CredentialsProvider from 'next-auth/providers/credentials';
import { client } from '@/lib/sanity';

export const runtime = 'edge';  // Keep edge runtime

// Add middleware config to specify edge
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Optional: specify deployment regions
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          );

          if (!user) {
            return null;
          }

          if (credentials.password === user.password) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };