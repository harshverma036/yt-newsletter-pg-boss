import dotenv from "dotenv";
dotenv.config();

import express, { type Application } from "express";
import userRouter from "./user/user";
import subscriberRouter from "./user/subscriber";

const app: Application = express();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/subscriber", subscriberRouter);

app.listen(3120, (_) => console.log("Server is running on port 3120"));
