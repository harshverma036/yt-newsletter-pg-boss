import { Router, type Request, type Response } from "express";
import db from "../prisma";
import z from "zod";

const subscriberRouter: Router = Router();

const subscribeSchema = z.object({
  email: z.email(),
  userId: z.uuid(),
});

subscriberRouter.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const validateData = subscribeSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const { email, userId } = validateData.data;
    const subscriber = await db.subscriber.create({
      data: { email, user: { connect: { id: userId } } },
    });

    return res.status(201).json({
      message: "Subscriber created successfully",
      data: { id: subscriber.id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default subscriberRouter;
