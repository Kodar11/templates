// app/api/query/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const session = getSession();

    const result = await session.run(query);

    const records = result.records.map((record) => record.toObject());

    await session.close();
    return NextResponse.json({ data: records }, { status: 200 });
  } catch (err: any) {
    console.error("Neo4j query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
