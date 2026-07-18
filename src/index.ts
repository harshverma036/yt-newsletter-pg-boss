import express, { type Application } from "express";

const app: Application = express();

app.listen(3120, (_) => console.log("Server is running on port 3120"));
