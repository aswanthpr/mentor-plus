import { Request,Response } from "express";

export interface IAuthController {
    menteeSignup(req:Request,res:Response):Promise<void>
} 