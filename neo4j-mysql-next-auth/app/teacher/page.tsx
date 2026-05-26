"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar/page";

export default function GraphSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paperA, setPaperA] = useState("");
    const [paperB, setPaperB] = useState("");
    const [citeResult, setCiteResult] = useState("");
    const [classPaperId, setClassPaperId] = useState("");
    const [classificationResult, setClassificationResult] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("/api/query", { query });
            setResults(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCitationCheck = async () => {
        setCiteResult("");
        try {
            const res = await axios.post("/api/does-cite", { paperA, paperB });
            setCiteResult(res.data.message || res.data.error);
        } catch (err: any) {
            setCiteResult(err.response?.data?.error || err.message);
        }
    };

    const handleClassification = async () => {
        setClassificationResult("");
        try {
            const res = await axios.post("/api/classification", { paperId: classPaperId });
            setClassificationResult(res.data.classification || res.data.message || res.data.error);
        } catch (err: any) {
            setClassificationResult(err.response?.data?.error || err.message);
        }
    };

    return (
        <>
        <Navbar/>
            <main className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-8">
                    <h1 className="text-2xl font-bold">Neo4j Research Paper Explorer</h1>

                    {/* Custom Cypher Query */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Run Custom Query</h2>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={6}
                            placeholder="Enter Cypher query here..."
                            className="w-full p-4 border rounded-md shadow-sm"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Searching..." : "Run Query"}
                        </button>
                        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
                        {results.length > 0 && (
                            <pre className="bg-gray-100 p-4 mt-4 rounded-md overflow-x-auto">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        )}
                    </section>

                    {/* Check Citation */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Check if Paper A cites Paper B (multi-level)</h2>
                        <div className="flex gap-2">
                            <input
                                value={paperA}
                                onChange={(e) => setPaperA(e.target.value)}
                                placeholder="Paper A ID"
                                className="flex-1 p-2 border rounded-md"
                            />
                            <input
                                value={paperB}
                                onChange={(e) => setPaperB(e.target.value)}
                                placeholder="Paper B ID"
                                className="flex-1 p-2 border rounded-md"
                            />
                        </div>
                        <button
                            onClick={handleCitationCheck}
                            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                        >
                            Check Citation Path
                        </button>
                        {citeResult && <p className="mt-2 text-gray-700">{citeResult}</p>}
                    </section>

                    {/* Classification Lookup */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Get Full Classification of a Paper</h2>
                        <input
                            value={classPaperId}
                            onChange={(e) => setClassPaperId(e.target.value)}
                            placeholder="Enter Paper ID"
                            className="w-full p-2 border rounded-md"
                        />
                        <button
                            onClick={handleClassification}
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Get Classification
                        </button>
                        {classificationResult && <p className="mt-2 text-gray-700">{classificationResult}</p>}
                    </section>
                </div>
            </main>
        </>
    );
}
