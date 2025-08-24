import { NextFunction, Request, Response } from "express";


export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const VALID_API_KEY = process.env.END_PT_AUTH;
        const token = req.headers["x-api-key"];
        if(!token){
            res.status(401).json({status : "error", data : null, error : "Please provide api key"});
            return;
        } 
        if(token != VALID_API_KEY){
            res.status(403).json({status : "error", data : null, error : "Invalid api key"});
            return;
        }
        next();
    } catch (error) {
        console.log("Middleware auth error : ", error);
        res.status(500).json({status : "error", data : null, error : "Internal Server error"});
        return;
    }
}