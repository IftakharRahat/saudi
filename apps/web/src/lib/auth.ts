import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { adminCredentialsSchema } from '@/lib/validation';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = adminCredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!admin) {
          return null;
        }

        const isPasswordValid = await compare(parsed.data.password, admin.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = String(user.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.role = typeof token.role === 'string' ? token.role : 'admin';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
