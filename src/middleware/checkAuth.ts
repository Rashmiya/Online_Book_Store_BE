/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

export const permissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json("No token found");
    }
    try {
      const data: any = jwt.verify(token, config.jwt_secret_key);
      if (data) {
        return next();
      } else {
        return res.status(403).send("Do not have Permission");
      }
    } catch {
      return res.status(403).json("Invalid Token");
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const roleCheck = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Unauthorized: Token not found" });
    }
    try {
      const decoded: any = jwt.verify(token, config.jwt_secret_key);
      const userRole = decoded.userRoll;

      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient permissions" });
      }

      // Optionally attach user to request
      (req as any).user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
