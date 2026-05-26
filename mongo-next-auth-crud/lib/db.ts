import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return; // already connected
  }

  await mongoose.connect(process.env.MONGO_URI!, {
    //@ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}
