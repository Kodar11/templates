import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  CourseName: { type: String, required: true },
  Credits: { type: Number, required: true }
});

export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
