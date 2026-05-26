import type { NextAuthOptions, User } from "next-auth";
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
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
            
                const db = await createConnection();
                const result: any = await db.execute(
                    "SELECT * FROM users WHERE email = ? ALLOW FILTERING",
                    [credentials.email]
                );
            
                if (result.rows.length === 0) {
                    throw new Error("User not found");
                }
            
                const user = result.rows[0];
            
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }
            
                return {
                    id: user.id.toString(),
                    name: user.name ?? "",   // Fallback empty string if name is undefined
                    email: user.email,
                    role: user.role
                };
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
