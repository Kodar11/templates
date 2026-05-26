// lib/neo4j.ts
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "Tanmay@11") // 🔒 Replace with your actual password
);

export const getSession = () => driver.session();
