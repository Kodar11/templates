import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid"; // ✅

export async function POST(req: Request) {
    try {
        // Connect to Cassandra database
        const db = await createConnection();

        // Parse request body
        const body = await req.json();
        const { CourseName, Credits } = body;

        // Validate input fields
        if (!CourseName) {
            return NextResponse.json({ error: "Course name is required" }, { status: 400 });
        }
        const creditsValue = parseInt(Credits, 10);

        if (isNaN(creditsValue)) {
            return NextResponse.json({ error: "Credits must be a valid number" }, { status: 400 });
        }

        // Generate a new UUID for the course
        const CourseID = uuidv4();

        // Insert the course into the database
        await db.execute(
            "INSERT INTO Courses (CourseID, CourseName, Credits) VALUES (?, ?, ?)",
            [CourseID, CourseName, creditsValue],
            { prepare: true }
        );

        // Return success response
        return NextResponse.json({ message: "Course added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error adding course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function GET() {
    try {
        // Check if the user is a teacher using the session
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        //@ts-ignore
        if (!session || session?.user?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized. Only teachers can add courses." }, { status: 403 });
        }

        // Connect to Cassandra
        const db = await createConnection();

        // Query to fetch all courses
        const result = await db.execute("SELECT * FROM Courses");

        // Map the rows from Cassandra result into a more usable format
        const courses = result.rows.map((row: any) => ({
            CourseID: row.courseid.toString(),     // not CourseID
            CourseName: row.coursename,             // not CourseName
            Credits: row.credits                    // credits is fine
        }));

        // Return the fetched courses
        return NextResponse.json({ data: courses }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

