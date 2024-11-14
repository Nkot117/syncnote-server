import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function validation(req:Request, res:Response, next: NextFunction)  {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(409).json({ message: error.array()[0].msg });
    }
    next();
  } 