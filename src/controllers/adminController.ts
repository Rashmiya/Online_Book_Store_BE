import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import adminService from "../services/adminService";
import { config } from "../utils/config";
import jwt, { JwtPayload } from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-explicit-any */

const adminController = {
  //getAllAdmins
  getAllAdmins: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const response: ApiResponse<any[]> =
        await adminService?.getAllAdminService();
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
  saveAdmin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { username, email, password }: any = req.body;
    try {
      if (!email) {
        return res.status(200).json({
          success: false,
          message: "Email Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> = await adminService?.saveAdminService(
        {
          username: username,
          email: email,
          password: password,
          role: "admin",
          orderCount: 0,
        }
      );

      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  loginAdmin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { email, password }: any = req.body;
    try {
      if (!email || !password) {
        const missingFields = [];
        if (!email) missingFields.push("Email");
        if (!password) missingFields.push("Password");

        const errorMessage = `Required Fields Are Missing: ${missingFields.join(
          ", "
        )}`;
        return res.status(200).json({
          success: false,
          message: errorMessage,
          data: null,
        });
      }
      const response: ApiResponse<any[]> = await adminService?.logInAdmin({
        email: email,
        password: password,
      });

      if (response?.success) {
        const dataStoredInToken = {
          email: email,
          userRoll: "admin",
        };

        const newAccessToken = jwt.sign(
          dataStoredInToken,
          config.jwt_secret_key,
          {
            expiresIn: 60 * 60 * 1000,
          }
        );

        const newRefreshToken = jwt.sign(
          dataStoredInToken,
          config.jwt_secretRe_key,
          {
            expiresIn: 60 * 60 * 24 * 1000,
          }
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 60 * 60 * 24 * 1000,
          httpOnly: true,
        });
      }
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      res.cookie("accessToken", "", {
        maxAge: -1,
        httpOnly: true,
      });
      res.cookie("refreshToken", "", {
        maxAge: -1,
        httpOnly: true,
      });
      res.cookie("userData", "", {
        maxAge: -1,
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "Successfully logged out",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  refresh: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const secret = config.jwt_secret_key;
      const refToken = req.cookies.refreshToken;

      const verifyRefToken = jwt.verify(
        refToken,
        config.jwt_secretRe_key
      ) as JwtPayload;
      if (!verifyRefToken) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const tempEmail: string = verifyRefToken.email;
        const response: ApiResponse<any[]> = await adminService?.refreshService(
          {
            email: tempEmail,
          }
        );
        if (response?.success) {
          const dataStoredInToken = {
            email: verifyRefToken.email,
            userRoll: "customer",
          };

          const newAccessToken = jwt.sign(dataStoredInToken, secret, {
            expiresIn: 60 * 60 * 1000,
          });

          res.cookie("accessToken", newAccessToken, {
            maxAge: 60 * 1000, // update as 60 * 60 * 1000
            httpOnly: true,
          });
        }
        return res.status(200).json({
          success: response?.success,
          message: response.message,
          data: response.data,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteAdmin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { adminId }: any = req?.query;

      if (!adminId) {
        return res.status(200).json({
          success: false,
          message: "Admin ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await adminService?.deleteAdminService({
          _id: adminId,
        });
      return res.status(200).json({
        success: response?.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;
