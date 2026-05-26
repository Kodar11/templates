import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createConnection } from "@/lib/db";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const db = await createConnection();
    const body = await req.json();
    let { email, password, role } = body; // ❌ Removed 'username' (not in schema)

    // Validate input fields
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert email to lowercase for consistency
    email = email.toLowerCase();

    // Check if user already exists
    const [existingUser]: any = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Corrected the SQL Query (Removed `username`)
    await db.execute(
      "INSERT INTO users (id, email, password, role) VALUES (UUID(), ?, ?, ?)",
      [email, hashedPassword, role]
    );

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
