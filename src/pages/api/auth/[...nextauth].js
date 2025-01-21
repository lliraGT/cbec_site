import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { client } from '@/lib/sanity';

// Add this line to specify the runtime
export const runtime = 'edge';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          );

          if (!user) {
            throw new Error('No user found');
          }

          // Important: In production, you should use proper password hashing
          if (credentials.password === user.password) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error.message ?? 'Authentication error');
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };