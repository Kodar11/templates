import type { NextAuthOptions, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db"; // ✅ fixed import
import { User1 } from "./models/user.models";

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

                await connectDB(); // ✅ connect to MongoDB
                //@ts-ignore
                const user = await User1.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return { id: user._id.toString(), name: user.name || "", email: user.email, role: user.role };
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
