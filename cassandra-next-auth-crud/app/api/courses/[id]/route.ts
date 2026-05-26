import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(NEXT_AUTH_CONFIG);

//     //@ts-ignore
//     if (!session || session?.user?.role !== "teacher") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const { id } = params;
//     console.log("ID : ",id);
    
//     const { CourseName, Credits } = await req.json();
//     const creditsValue = parseInt(Credits, 10);

//     if (!CourseName || isNaN(creditsValue)) {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     const db = await createConnection();
//     //@ts-ignore
//     await db.execute(
//       "UPDATE Courses SET coursename = ?, credits = ? WHERE courseid = ?",
//       [CourseName, creditsValue, id]
//     );

//     return NextResponse.json({ message: "Course updated successfully" });
//   } catch (error: any) {
//     console.error("Error updating course:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//     try {
//       const session = await getServerSession(NEXT_AUTH_CONFIG);
  
//       //@ts-ignore
//       if (!session || session?.user?.role !== "teacher") {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//       }
  
//       const { id } = params;
//       const { CourseName, Credits } = await req.json();
//       const creditsValue = parseInt(Credits, 10);
  
//       if (!CourseName || isNaN(creditsValue)) {
//         return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//       }
  
//       const db = await createConnection();
//       //@ts-ignore
//       await db.execute(
//         "UPDATE Courses SET coursename = ?, credits = ? WHERE courseid = ?",
//         [
//           CourseName,
//           { value: creditsValue, hint: 'int' }, // <-- fix here!
//           id
//         ]
//       );
  
//       return NextResponse.json({ message: "Course updated successfully" });
//     } catch (error: any) {
//       console.error("Error updating course:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }



export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);

    //@ts-ignore
    if (!session || session?.user?.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params; // corrected
    const { CourseName, Credits } = await req.json();
    const creditsValue = parseInt(Credits, 10);

    if (!CourseName || isNaN(creditsValue)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const db = await createConnection();
    //@ts-ignore
    await db.execute(
      "UPDATE Courses SET coursename = ?, credits = ? WHERE courseid = ?",
      [CourseName, creditsValue, id],
      { prepare: true } // <-- important fix
    );

    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

  
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);

    //@ts-ignore
    if (!session || session?.user?.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } =await params;

    const db = await createConnection();
    //@ts-ignore
    await db.execute("DELETE FROM Courses WHERE courseid = ?", [id]);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
