import { NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paperA = String(body.paperA);
    const paperB = String(body.paperB);

    const session = getSession();
    console.log("Paper A:", paperA);
    console.log("Paper B:", paperB);

    const query = `
      MATCH path=(a:Paper {id: $paperA})-[:CITES*1..5]->(b:Paper {id: $paperB})
      RETURN length(path) AS levels
      LIMIT 5
    `;

    const result = await session.run(query, { paperA, paperB });

    await session.close();

    if (result.records.length === 0) {
      return NextResponse.json({ message: "No citation path found." }, { status: 200 });
    }

    const levels = result.records[0].get("levels");

    return NextResponse.json({ message: `Paper A cites Paper B through ${levels} level(s).` }, { status: 200 });
  } catch (err: any) {
    console.error("Neo4j citation query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
