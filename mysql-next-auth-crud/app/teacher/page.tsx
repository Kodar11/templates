"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar/page";

interface Course {
    CourseID: number;
    CourseName: string;
    Credits: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseForm, setCourseForm] = useState({ CourseName: "", Credits: "" });
    const [editingRow, setEditingRow] = useState<Course | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get<{ data: Course[] }>("/api/courses");
            setCourses(response.data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingRow) {
                await axios.put(`/api/courses/${editingRow.CourseID}`, courseForm);
            } else {
                await axios.post("/api/courses", courseForm);
            }
            setCourseForm({ CourseName: "", Credits: "" });
            setEditingRow(null);
            fetchCourses();
        } catch (error) {
            console.error("Error saving course:", error);
        }
    };

    const handleEdit = (course: Course) => {
        setEditingRow(course);
        setCourseForm({ CourseName: course.CourseName, Credits: String(course.Credits) });
    };

    const handleDelete = async (course: Course) => {
        try {
            await axios.delete(`/api/courses/${course.CourseID}`);
            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Courses Management</h1>

                <form onSubmit={handleCourseSubmit} className="mb-8 p-4 border rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">{editingRow ? "Edit Course" : "Add New Course"}</h2>
                    <input
                        type="text"
                        placeholder="Course Name"
                        className="border p-2 mb-4 w-full"
                        value={courseForm.CourseName}
                        onChange={(e) => setCourseForm({ ...courseForm, CourseName: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Credits"
                        className="border p-2 mb-4 w-full"
                        value={courseForm.Credits}
                        onChange={(e) => setCourseForm({ ...courseForm, Credits: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        {editingRow ? "Update" : "Add"} Course
                    </button>
                </form>

                {courses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border p-2">CourseID</th>
                                    <th className="border p-2">CourseName</th>
                                    <th className="border p-2">Credits</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.CourseID} className="border-t">
                                        <td className="border p-2">{course.CourseID}</td>
                                        <td className="border p-2">{course.CourseName}</td>
                                        <td className="border p-2">{course.Credits}</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No courses available.</p>
                )}
            </div>
        </>
    );
}
