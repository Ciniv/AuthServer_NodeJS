import { RefreshJWT } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const generate_token = (user: Object): string => {
    return jwt.sign(user, "secret_key", {expiresIn: '15m'});
}

export const generate_refresh_token = (user: Object): string => {
    return jwt.sign(user, "refresh_secret_key");
}

export const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(' ')[1];

    if (token) {
        jwt.verify(token, "secret_key", (err, user) => {
            if(err) return res.sendStatus(401);
            req.user = user;
            next()
        })
    } else {
        return res.sendStatus(401);
    }
}
