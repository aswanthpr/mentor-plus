import {NextFunction, Request ,Response} from "express"
export interface IreviewController {
    reviewNdRateMentor(req:Request,res:Response,next: NextFunction):Promise<void>;
}