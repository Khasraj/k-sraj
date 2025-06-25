import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        phone: { label: "Phone Number", type: "tel" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if ((!credentials?.username && !credentials?.phone) || !credentials?.password) {
          throw new Error('Please enter your username/phone number and password');
        }

        // Try to find user by username or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.username || '' },
              { phoneNumber: credentials.phone || '' }
            ]
          }
        });

        if (!user) {
          throw new Error('No user found with these credentials');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 