import { Router, type Request, type Response } from "express";
import z from "zod";
import bcrypt from "bcrypt";
import db from "../prisma";

const userRouter: Router = Router();

const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    console.log(JSON.stringify(req?.body));
    const validatedData = registerSchema.safeParse(req?.body);

    if (!validatedData?.success) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const { name, email, password } = validatedData?.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    // checkling email is already in use
    const emailInUse = await db.user.findUnique({
      where: { email },
    });

    if (emailInUse) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: { id: user.id } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
