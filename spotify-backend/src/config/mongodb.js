import mongoose from "mongoose";

const stripQuotes = (value) => {
  if (!value) return "";
  let v = String(value).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
};

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  const mongoUri = stripQuotes(process.env.MONGODB_URI);

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error(
      'Invalid MONGODB_URI: must start with "mongodb://" or "mongodb+srv://"'
    );
  }

  await mongoose.connect(mongoUri);
};

export default connectDB;