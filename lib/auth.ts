import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        code: { label: 'Access Code', type: 'password' },
      },

      async authorize(credentials) {
        const submitted = (credentials?.code ?? '').trim();

        if (!submitted) {
          return null;
        }

        // Shared access code. Set CAPTAIN_ACCESS_CODE in Vercel to change it
        // anytime without a code push. Falls back to a default for first use.
        const validCode =
          process.env.CAPTAIN_ACCESS_CODE?.trim() || 'CaboTCB2026';

        if (submitted !== validCode) {
          return null;
        }

        try {
          // Map the shared code to the captain account so anything posted
          // (reports, reviews, photos) still has a valid author.
          const captainEmail =
            process.env.CAPTAIN_EMAIL?.trim().toLowerCase() ||
            'captain@stripedworldcharters.com';

          let user = await prisma.user.findUnique({
            where: { email: captainEmail },
          });

          // If the captain account doesn't exist yet, fall back to the first
          // admin so login never hard-fails on a fresh database.
          if (!user) {
            user = await prisma.user.findFirst({
              where: { role: 'admin' },
            });
          }

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },

  pages: {
    signIn: '/captain/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
