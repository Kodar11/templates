import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth"; // your next-auth config path

// ✅ Add Course (Teacher only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        //@ts-ignore
        if (!session || session?.user?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized. Only teachers can add courses." }, { status: 403 });
        }

        const { CourseName, Credits } = await req.json();
        const creditsValue = parseInt(Credits, 10);

        if (!CourseName || isNaN(creditsValue)) {
            return NextResponse.json({ error: "Invalid input: CourseName and Credits are required." }, { status: 400 });
        }

        const db = await createConnection();
        const sql = "INSERT INTO Courses (CourseName, Credits) VALUES (?, ?)";
        await db.query(sql, [CourseName, creditsValue]);

        return NextResponse.json({ message: "Course added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        //@ts-ignore
        if (!session || session?.user?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized. Only teachers can add courses." }, { status: 403 });
        }

        const db = await createConnection();
        const [rows] = await db.query("SELECT * FROM Courses");

        return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}