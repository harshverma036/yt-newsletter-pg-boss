import dotenv from "dotenv";
dotenv.config();

import express, { type Application } from "express";
import userRouter from "./user/user";
import subscriberRouter from "./user/subscriber";
import boss from "./pgboss";
// import createQueues from "./queues";
import { WELCOME_EMAIL_QUEUE } from "./constant";

const app: Application = express();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/subscriber", subscriberRouter);

boss.start().then(async () => {
  console.log("pg-boss started");

  await boss.createQueue(WELCOME_EMAIL_QUEUE + "_DEAD_LETTER", {
    policy: "standard",
  });

  await boss.createQueue(WELCOME_EMAIL_QUEUE, {
    policy: "standard",
    // deadLetter: WELCOME_EMAIL_QUEUE + "_DEAD_LETTER",
    retryLimit: 3,
    retryDelay: 120000, // 2 mins
  });
});
app.listen(3120, () => console.log("Server is running on port 3120"));
