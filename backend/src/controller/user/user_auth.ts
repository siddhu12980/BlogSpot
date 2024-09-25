import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { signupInput } from '@sidd123/common';
import client from "../../db"

const prisma = client;
export const signup = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const { success } = signupInput.safeParse(body);

        if (!success) {
            return res.status(400).json({ error: "Type Validation Failed" });
        }


        const hashedPassword = await bcrypt.hash(body.password, 10);


        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name,
            },
        });


        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
        };
        const token = sign(payload, process.env.JWT_SECRET!);

        return res.status(200).json({ token });

    } catch (e: any) {
        console.log(e);
        return res.status(400).json({ error: e.message });
    }
};


export const signinController = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const { success } = signupInput.safeParse(body);

        if (!success) {
            return res.status(400).json({ error: "Type Validation Failed" });
        }



        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });



        if (!user) {
            return res.status(401).json({ error: 'User Not Found' });
        }


        try {
            const isValid = await bcrypt.compare(body.password, user.password);

            if (!isValid) {
                return res.status(401).json({ error: 'Invalid Password' });
            }
        } catch (err) {
            console.error("Error in bcrypt.compare:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }


        const payload = {
            email: user.email,
            id: user.id,
            name: user.name,
            exp: Math.floor(Date.now() / 1000) + 60 * 30,
        };


        const token = sign(payload, process.env.JWT_SECRET!);


        return res.status(200).json({ token });

    } catch (e: any) {
        console.log(e);
        return res.status(400).json({ error: e.message });
    }
};
