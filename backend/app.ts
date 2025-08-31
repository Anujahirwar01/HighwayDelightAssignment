import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db";
import userRoutes from "./routes/user.routes";
import notesRoutes from "./routes/notes.routes";

const app: Application = express();
connectDB();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://hdnotesassignment.netlify.app',  // Your deployed frontend
    'https://highwaydelightassignment.onrender.com'  // Your deployed backend (for health checks)
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/notes", notesRoutes);

export default app;
