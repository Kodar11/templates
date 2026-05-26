import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createConnection } from "@/lib/db";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const db = await createConnection();
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const [existingUser]: any = await db.execute(
      "SELECT * FROM users WHERE email = ? ALLOW FILTERING",
      [normalizedEmail]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.execute(
      "INSERT INTO users (id, email, password, role) VALUES (UUID(), ?, ?, ?)",
      [normalizedEmail, hashedPassword, role]
    );

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
