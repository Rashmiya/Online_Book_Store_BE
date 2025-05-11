import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../utils/config";
import { ApiResponse } from "../utils/interfaces/commonInterface";
import CustomerService from "../services/customerService";
/* eslint-disable @typescript-eslint/no-explicit-any */

const CustomerController = {
  getAllCustomer: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { page, perPage, sort, customerName }: any = req.query;
    try {
      const parsedPage = parseInt(page, 10) || 1;
      const parsedPerPage = parseInt(perPage, 10) || 10;
      const parsedSort = parseInt(sort) || 1;
      const response: ApiResponse<any[]> =
        await CustomerService?.getAllCustomerService({
          page: parsedPage,
          perPage: parsedPerPage,
          sort: parsedSort,
          customerName,
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

  saveCustomer: async (
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
      const response: ApiResponse<any[]> =
        await CustomerService?.saveCustomerService({
          username: username,
          email: email,
          password: password,
          role: "customer",
          orderCount: 0,
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

  loginCustomer: async (
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
      const response: ApiResponse<any[]> = await CustomerService?.logInCustomer(
        {
          email: email,
          password: password,
        }
      );

      if (response?.success) {
        const dataStoredInToken = {
          email: email,
          userRoll: "customer",
        };

        const newAccessToken = jwt.sign(
          dataStoredInToken,
          config.jwt_secret_key,
          {
            expiresIn: "15m", // 15 minutes
          }
        );

        const newRefreshToken = jwt.sign(
          dataStoredInToken,
          config.jwt_secretRe_key,
          {
            expiresIn: "7d", // 7 days
          }
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: 15 * 60 * 1000, // 15 minutes
          httpOnly: true,
        });

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

  userDetailUpdate: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const {
      id,
      username,
      email,
      dob,
      mobile_number,
      shippingAddress,
      orderCount,
    }: any = req.body;

    try {
      if (!email) {
        return res.status(200).json({
          success: false,
          message: "Email Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await CustomerService?.updateCustomerService({
          _id: id,
          username: username,
          email: email,
          dob: new Date(dob),
          shippingAddress: shippingAddress,
          mobile_number: mobile_number,
          orderCount: orderCount || 0,
          role: "customer",
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
        const response: ApiResponse<any[]> =
          await CustomerService?.refreshService({
            email: tempEmail,
          });
        if (response?.success) {
          const dataStoredInToken = {
            email: verifyRefToken.email,
            userRoll: "customer",
          };

          const newAccessToken = jwt.sign(dataStoredInToken, secret, {
            expiresIn: "15m", // 15 minutes
          });

          res.cookie("accessToken", newAccessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
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

  userDetail: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { email }: any = req.query;
    try {
      const response: ApiResponse<any[]> =
        await CustomerService?.getUserDetails({
          email: email,
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

  deleteCustomer: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { customerId }: any = req?.query;

      if (!customerId) {
        return res.status(200).json({
          success: false,
          message: "Customer ID Required!",
          data: null,
        });
      }
      const response: ApiResponse<any[]> =
        await CustomerService?.deleteCustomerService({
          _id: customerId,
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

export default CustomerController;
