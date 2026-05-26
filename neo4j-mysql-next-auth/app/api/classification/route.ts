// app/api/classification/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";

export async function POST(req: Request) {
  try {
    const  body  = await req.json();
    const paperId = String(body.paperId);
    console.log(paperId);
    
    const session = getSession();

    const query = `
      MATCH (p:Paper {id: $paperId})
      RETURN p.filename AS filename
    `;

    const result = await session.run(query, { paperId });

    if (result.records.length === 0) {
      await session.close();
      return NextResponse.json({ message: "Paper not found." }, { status: 404 });
    }

    const filename = result.records[0].get("filename");

    const classificationQuery = `
      MATCH (c:Classification {filename: $filename})
      RETURN c.classification AS classification
    `;

    const classificationResult = await session.run(classificationQuery, { filename });

    await session.close();

    if (classificationResult.records.length === 0) {
      return NextResponse.json({ message: "No classification found for the paper." }, { status: 200 });
    }

    const classification = classificationResult.records[0].get("classification");

    return NextResponse.json({ classification }, { status: 200 });
  } catch (err: any) {
    console.error("Neo4j classification query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
