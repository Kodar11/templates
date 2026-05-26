// ✅ Update Course (Teacher only)
import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth"; // your next-auth config path

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        
        //@ts-ignore
        if (!session || session?.user?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized. Only teachers can add courses." }, { status: 403 });
        }

        const { id } = params;
        const { CourseName, Credits } = await req.json();
        const creditsValue = parseInt(Credits, 10);

        if (!CourseName || isNaN(creditsValue)) {
            return NextResponse.json({ error: "Invalid input: CourseName and Credits are required." }, { status: 400 });
        }

        const db = await createConnection();
        const sql = "UPDATE Courses SET CourseName = ?, Credits = ? WHERE CourseID = ?";
        await db.query(sql, [CourseName, creditsValue, id]);

        return NextResponse.json({ message: "Course updated successfully" });
    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ✅ Delete Course (Teacher only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);

        //@ts-ignore
        if (!session || session?.user?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized. Only teachers can add courses." }, { status: 403 });
        }

        const { id } = params;

        const db = await createConnection();
        const sql = "DELETE FROM Courses WHERE CourseID = ?";
        await db.query(sql, [id]); // important: wrap id inside an array

        return NextResponse.json({ message: "Course deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}