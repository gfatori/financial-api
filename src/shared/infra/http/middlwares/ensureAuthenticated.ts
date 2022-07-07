import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { JWTInvalidTokenError } from "../../../errors/JWTInvalidTokenError";
import { JWTTokenMissingError } from "../../../errors/JWTTokenMissingError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new JWTTokenMissingError()
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, '7931646b0f6348d5fc83ec36d43ef151') as IPayload;

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new JWTInvalidTokenError()
  }
}
