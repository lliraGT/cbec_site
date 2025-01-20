import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { client } from '@/lib/sanity';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Add console.log to debug the query
          console.log('Querying user with email:', credentials.email);
          
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]{
              _id,
              name,
              email,
              password,
              role
            }`,
            { email: credentials.email }
          );

          console.log('Found user:', user); // Debug log

          if (user && credentials.password === user.password) {
            // Return user with role explicitly
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role // Make sure role is included
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add debugging logs
      console.log('JWT Callback - User:', user);
      console.log('JWT Callback - Current Token:', token);
      
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add debugging logs
      console.log('Session Callback - Token:', token);
      console.log('Session Callback - Current Session:', session);
      
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  debug: true, // Enable debug mode
  pages: {
    signIn: '/auth/login',
  }
});