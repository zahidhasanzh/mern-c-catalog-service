import { expressjwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import JwksClient from "jwks-rsa";
import { AuthCookie } from "../types";
import config from "config";

export default expressjwt({
    secret: JwksClient.expressJwtSecret({
        jwksUri: config.get("auth.jwksUri"),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ["RS256"],

    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        //Bearer ejyllsdfsdfdsfdsdfdsfd
        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
