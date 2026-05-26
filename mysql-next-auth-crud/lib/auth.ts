import type { NextAuthOptions, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { createConnection } from "@/lib/db";

interface CustomUser extends User {
    id: string;
    role: "teacher" | "student";
}

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const db = await createConnection();
                const [rows]: any = await db.execute(
                    "SELECT * FROM users WHERE email = ?",
                    [credentials.email]
                );

                if (rows.length === 0) {
                    throw new Error("User not found");
                }

                const user = rows[0];
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return { id: user.id.toString(), name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.uid = user.id;
                token.role = (user as CustomUser).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                //@ts-ignore
                session.user.id = token.uid as string;
                //@ts-ignore
                session.user.role = token.role as "teacher" | "student";
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};
