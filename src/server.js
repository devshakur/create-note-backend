import "dotenv/config"
import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import {connectDB, disconnectDB} from "./config/db.js"
connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use("/auth", authRoutes)
app.use("/notes", notesRoutes)

const PORT = 8080;

const server = app.listen(PORT, ()=> {
    console.log(`Server running on Port ${PORT}`);
    
})

process.on("unhandledRejection", async (err)=> {
    console.error("Unhandled Rejection:", err);
    server.close(async ()=> {
        await disconnectDB();
        process.exit(1);
    });
})

process.on("uncaughtException", async (err)=> {
    console.error("Uncaught Exception:", err);
    server.close(async ()=> {
        await disconnectDB();
        process.exit(1);
    });
})

process.on("SIGTERM", async ()=> {
    console.error("SIGTERM received, shutting down gracefullly");
    server.close(async ()=> {
        await disconnectDB();
        process.exit(1);
    });
})  