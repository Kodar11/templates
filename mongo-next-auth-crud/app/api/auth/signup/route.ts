import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User1 } from "@/lib/models/user.models";
import mongoose from "mongoose";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    let { email, password, role } = body;

    // Validate input fields
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert email to lowercase for consistency
    email = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User1.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user and save to database
    const user = new User1({ id: new mongoose.Types.ObjectId().toString(), email, password: hashedPassword, role });
    await user.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
